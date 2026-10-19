"""Groq-powered refund agent governed by AgentTrust (REAL calls, no mocks).

The LLM decides WHEN a refund is warranted; AgentTrust decides WHETHER it
is allowed. Every tool call flows through:
    authorize -> [human approval if REVIEW] -> single-use grant -> execute

Prerequisites (in the venv):
    pip install openai          # Groq exposes an OpenAI-compatible API

Environment:
    GROQ_API_KEY        from https://console.groq.com/keys
    AGENTTRUST_API_KEY  the demo requester key (at_QR2_...)
    AGENTTRUST_API_URL  http://localhost:8000  (default)

Run:
    python groq_agent.py
Then type customer messages, for example:
    I was double-charged on ORD-100, please refund $35      -> auto-approved
    Refund $900 on ORD-100, this is unacceptable              -> denied by policy
    Item arrived damaged (ORD-100), I'd like a $150 refund   -> needs YOUR approval
Type 'quit' to exit.
"""

import json
import os
import sys

from openai import OpenAI

from agenttrust import (
    AgentTrust,
    AgentTrustError,
    ApprovalExpired,
    ApprovalRejected,
    ApprovalRequired,
    ApprovalTimeout,
    AuthorizationDenied,
)

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
AGENTTRUST_API_KEY = os.environ.get("AGENTTRUST_API_KEY", "")
AGENTTRUST_API_URL = os.environ.get("AGENTTRUST_API_URL", "http://localhost:8000").rstrip("/")

SYSTEM_PROMPT = """You are a customer support agent for an online store.
When the customer asks for a refund, call the refund_payment tool with the
order id and the amount in minor units (cents: $35 = 3500, $150 = 15000).
Only call the tool when the customer actually requests a refund. Otherwise
just reply conversationally. Keep replies short."""

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "refund_payment",
            "description": "Issue a refund to the customer for an order.",
            "parameters": {
                "type": "object",
                "properties": {
                    "order_id": {
                        "type": "string",
                        "description": "Order reference, e.g. ORD-100",
                    },
                    "amount_minor": {
                        "type": "integer",
                        "description": "Refund amount in minor units (cents).",
                    },
                    "currency": {
                        "type": "string",
                        "description": "ISO currency code",
                        "default": "USD",
                    },
                },
                "required": ["order_id", "amount_minor"],
            },
        },
    }
]


def main() -> int:
    if not GROQ_API_KEY:
        print("error: set GROQ_API_KEY (get one free at https://console.groq.com/keys)",
              file=sys.stderr)
        return 2
    if not AGENTTRUST_API_KEY:
        print("error: set AGENTTRUST_API_KEY (the demo requester key from seed_demo)",
              file=sys.stderr)
        return 2

    groq = OpenAI(api_key=GROQ_API_KEY, base_url="https://api.groq.com/openai/v1")
    trust = AgentTrust(api_key=AGENTTRUST_API_KEY, base_url=AGENTTRUST_API_URL, timeout=10.0)

    @trust.protect(tool="refund_payment")
    def refund_payment(order_id: str, amount_minor: int, currency: str = "USD"):
        # Never executed by the SDK — the gateway performs the real effect.
        raise RuntimeError("unreachable")

    print("Groq refund agent live. Type a customer message (or 'quit').")
    print("Try:  I was double-charged on ORD-100, please refund $35")
    print("Try:  Refund $900 on ORD-100, this is unacceptable")
    print("Try:  Item arrived damaged (ORD-100), I'd like a $150 refund")
    print()

    while True:
        try:
            message = input("customer> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nbye.")
            return 0
        if message.lower() in {"quit", "exit"}:
            print("bye.")
            return 0
        if not message:
            continue

        with trust.run(agent="groq-refund-agent", version="1.0"):
            reply = groq.chat.completions.create(
                model="openai/gpt-oss-120b",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": message},
                ],
                tools=TOOLS,
                tool_choice="auto",
            ).choices[0].message

            if not reply.tool_calls:
                print(f"agent> {reply.content}\n")
                continue

            call = reply.tool_calls[0]
            args = json.loads(call.function.arguments)
            # Normalize: order refs are uppercase in the ledger.
            if isinstance(args.get("order_id"), str):
                args["order_id"] = args["order_id"].upper()
            dollars = args["amount_minor"] / 100
            print(f"[llm] wants refund_payment(order_id={args['order_id']}, "
                  f"amount=${dollars:.2f}) -> asking AgentTrust...")

            try:
                result = refund_payment(**args)
            except AuthorizationDenied as exc:
                print(f"agent> Sorry, our policy doesn't allow this refund "
                      f"({exc.reason_code}).\n")
                continue
            except ApprovalRequired as exc:
                print(">>> AgentTrust says: HUMAN APPROVAL REQUIRED.")
                print(">>> Open http://localhost:3000/approvals and approve/reject")
                print(">>> it within 3 minutes. Waiting...")
                try:
                    result = trust.wait_for_approval(exc.approval_id, timeout_s=180.0)
                except ApprovalTimeout:
                    print("agent> Your refund is still pending review — we'll "
                          "notify you once it's decided.\n")
                    continue
                except (ApprovalRejected, ApprovalExpired):
                    print("agent> Your refund request was not approved.\n")
                    continue
            except AgentTrustError as exc:
                print(f"agent> Something went wrong: {exc}\n")
                continue

            remaining = (result or {}).get("remaining_minor")
            print(f"agent> Done — refunded ${dollars:.2f} for order "
                  f"{args['order_id']}."
                  + (f" Remaining balance: ${remaining / 100:.2f}." if remaining is not None else "")
                  + "\n")


if __name__ == "__main__":
    raise SystemExit(main())
