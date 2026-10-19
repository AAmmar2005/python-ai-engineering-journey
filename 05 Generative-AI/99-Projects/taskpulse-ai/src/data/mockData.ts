import { Blueprint, SyllabusTemplate } from '../types';

export const USER_AVATAR_1 = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOTWHYOlrCdVsQbX2ycFnIC1zJw6xqUZ9cKZ6D-Q8PQQJ0XI5quMJvAdU5S80mPhrWtkcDDmtvzo93Iqb-c-B4ulRWo5E3aMjOxM76jT-hFGyCiYPbe9bJ0XcGCoiyN6Z1X6nKd6JwqfRVQB9XII_rudVpnabyBR756YvTThkSJ2jUlW5H9FkxR8_7AYMwIVpu6PD5eCICfMFQXEI-KI8vaEjo7qr5FMmJprbOH4VgrJvWM7ZSHNg-3kqbsRiF_R75SJQlZzYfTHbr';
export const USER_AVATAR_2 = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcNLmbIigs3T1BGMIbimQ60bwJnlBEpa3TQgxo0_pXFGxM9sF8ma-9_MVC8bGUHdLMu9R2mMeqEL5MtgtPVoUKW9JsZ24tx0s7Rjbon3cjmwsaHCB4BNbzFki62dZWOqLuxP4YAjL2wdOJ4v4qH1b85uCLCm_Aj5g2_-ctMmWXr2xtivP2aVS3DnxShHwBLEZb_XMj0iK9PHWKw0qXJKpkhvvAmhsRTJ-z2Vs8iMmKxzzCTdEpex6KnlP_g74BZwNU8Hw7tlpZop3L';

export const SYLLABUS_TEMPLATES: SyllabusTemplate[] = [
  {
    id: 'tpl-neural',
    name: 'CS 480: Deep Learning & Neural Networks',
    category: 'Computer Science',
    description: '4-week intensive study sprint covering backpropagation, loss functions, activation architectures, and optimization algorithms.',
    briefText: `COURSE SYLLABUS: CS 480 - Neural Networks & Deep Learning
Instructor: Dr. E. Hinton
Duration: 4 Weeks (Intensive Sprint)

Week 1: Fundamentals & History
- Readings: Chapter 1-2 (Perceptrons and Linear Separability)
- Milestone: Understand multi-layer perceptron limitations.
- Estimated load: 4.5 hrs total.

Week 2: Backpropagation Core
- Readings: Rumelhart et al. 1986 seminal paper.
- Labs: Derive chain rule manually for 3-layer architecture.
- Practical assignment: Implement basic gradient descent in Python without frameworks.
- Visualization assignment: Plot weight updates during loss minimization.

Week 3: Activation Functions & Vanishing Gradients
- Focus: ReLU, Leaky ReLU, Sigmoid, and Softmax derivations.
- Special topic: What is the vanishing gradient problem and how batch normalization mitigates it.
- Scheduled test: Mid-sprint quiz on Wednesday.

Week 4: Optimization Algorithms & Regularization
- Topics: Adam optimizer, RMSProp, Dropout, L1/L2 regularization.
- Final Project Due: Build an MNIST classifier from scratch.`,
    sampleBlueprintId: 'bp-neural'
  },
  {
    id: 'tpl-econ',
    name: 'ECON 101: Microeconomic Principles & Markets',
    category: 'Economics',
    description: 'Comprehensive syllabus covering supply and demand equilibrium, elasticities, market structures, and game theory.',
    briefText: `ECON 101 Syllabus - Fall Semester
Weekly readings: Mankiw Principles of Economics Ch. 1-8.
Key topics:
1. Opportunity Cost and Production Possibility Frontiers (PPF)
2. Supply, Demand, and Market Equilibrium shifts
3. Price Elasticity of Demand and Tax Incidence
4. Consumer & Producer Surplus (Deadweight Loss calculations)
5. Monopoly vs Perfect Competition market analysis

Important Dates:
- Midterm Exam on Oct 12th (covers modules 1-3)
- Policy simulation paper due Nov 15th
- Final comprehensive project due Dec 1st.`,
    sampleBlueprintId: 'bp-econ'
  },
  {
    id: 'tpl-sysdesign',
    name: 'System Design Architecture Sprint',
    category: 'Software Engineering',
    description: 'High-concurrency scalable architecture prep for senior engineering roles covering caching, sharding, and consensus.',
    briefText: `System Design Master Sprint - 3 Week Intensive
Goal: Prepare for distributed systems engineering interviews and real-world infrastructure scaling.

Module 1: Load Balancing & Caching Strategies
- Consistent hashing algorithms
- Redis/Memcached distributed caching patterns (Read-through, Write-back)
- Content Delivery Networks (CDN) edge routing

Module 2: Database Partitioning & Sharding
- CAP Theorem and ACID vs BASE trade-offs
- Horizontal sharding strategies & hot-spot mitigation
- B-Trees vs LSM-Trees storage engine mechanics

Module 3: Distributed Consensus & Messaging
- Kafka / RabbitMQ event-driven messaging pipelines
- Raft consensus protocol mechanics
- Rate limiting algorithms (Token bucket, Leaky bucket).`,
    sampleBlueprintId: 'bp-sysdesign'
  }
];

export const MOCK_BLUEPRINTS: Record<string, Blueprint> = {
  'bp-neural': {
    id: 'bp-neural',
    title: 'Study Sprint: Neural Networks',
    subtitle: 'AI-Generated Blueprint • 12 Task Units',
    readinessScore: 65,
    createdAt: 'Today at 09:42 AM',
    lastUpdated: 'Today at 09:42 AM',
    syllabusText: SYLLABUS_TEMPLATES[0].briefText,
    weeklyTimeline: [
      {
        weekNumber: 1,
        totalWeeks: 4,
        title: 'Fundamentals & History',
        statusText: 'Completed • 4.5 hrs total',
        status: 'completed',
        hoursTotal: 4.5,
        milestonesLeft: 0,
        milestones: [
          { id: 'm-101', title: 'Perceptrons and linear separability review', completed: true },
          { id: 'm-102', title: 'Complete Chapter 1 & 2 quiz exercises', completed: true },
          { id: 'm-103', title: 'Setup local Python tensor environment', completed: true }
        ]
      },
      {
        weekNumber: 2,
        totalWeeks: 4,
        title: 'Backpropagation Core',
        statusText: 'Active • 2 milestones left',
        status: 'active',
        hoursTotal: 6.0,
        milestonesLeft: 2,
        milestones: [
          { id: 'm-201', title: 'Derive chain rule manually', completed: true },
          { id: 'm-202', title: 'Implement basic gradient descent', completed: false },
          { id: 'm-203', title: 'Visualize weight updates', completed: false }
        ]
      },
      {
        weekNumber: 3,
        totalWeeks: 4,
        title: 'Activation Functions',
        statusText: 'Scheduled for Wednesday',
        status: 'scheduled',
        hoursTotal: 5.0,
        milestonesLeft: 3,
        milestones: [
          { id: 'm-301', title: 'Compare ReLU vs Leaky ReLU gradient flow', completed: false },
          { id: 'm-302', title: 'Analyze vanishing gradient mitigation', completed: false },
          { id: 'm-303', title: 'Complete Mid-Sprint Practice Test', completed: false }
        ]
      },
      {
        weekNumber: 4,
        totalWeeks: 4,
        title: 'Optimization & Regularization',
        statusText: 'Scheduled for next week',
        status: 'scheduled',
        hoursTotal: 7.5,
        milestonesLeft: 4,
        milestones: [
          { id: 'm-401', title: 'Implement Adam & RMSProp momentum formulas', completed: false },
          { id: 'm-402', title: 'Apply Dropout and L2 weight decay', completed: false },
          { id: 'm-403', title: 'Build MNIST classifier from scratch', completed: false },
          { id: 'm-404', title: 'Submit Final Blueprint Portfolio', completed: false }
        ]
      }
    ],
    criticalMilestones: [
      {
        id: 'cm-1',
        title: 'Derive chain rule manually',
        completed: true,
        category: 'core',
        aiTip: 'Remember: The chain rule multiplies local gradients backward from loss to each weight matrix.'
      },
      {
        id: 'cm-2',
        title: 'Implement basic gradient descent',
        completed: false,
        category: 'lab',
        aiTip: 'Start with a simple 2D parabola quadratic function before extending to multidimensional tensors.'
      },
      {
        id: 'cm-3',
        title: 'Visualize weight updates',
        completed: false,
        category: 'lab',
        aiTip: 'Use matplotlib to plot loss trajectories against learning rate hyperparameter choices.'
      },
      {
        id: 'cm-4',
        title: 'Mitigate vanishing gradient problem',
        completed: false,
        category: 'theory',
        aiTip: 'Notice how ReLU maintains a derivative of 1 for positive inputs, preventing exponential decay in deep networks.'
      }
    ],
    flashcards: [
      {
        id: 'fc-1',
        question: 'What is the vanishing gradient problem?',
        answer: 'When gradients become extremely small during backprop, effectively stopping the weights from changing in early network layers.',
        difficulty: 'Hard',
        category: 'Backpropagation',
        reviewedCount: 3,
        lastRating: 'review'
      },
      {
        id: 'fc-2',
        question: 'Why is ReLU preferred over Sigmoid in deep hidden layers?',
        answer: 'ReLU does not saturate in the positive domain (derivative is always 1 when x > 0), preventing gradient shrinkage and speeding up convergence.',
        difficulty: 'Medium',
        category: 'Activation Functions',
        reviewedCount: 5,
        lastRating: 'correct'
      },
      {
        id: 'fc-3',
        question: 'What does the learning rate (α) control in gradient descent?',
        answer: 'The step size taken in the direction opposite to the gradient during parameter updates: w_new = w_old - α * ∇L.',
        difficulty: 'Easy',
        category: 'Optimization',
        reviewedCount: 4,
        lastRating: 'correct'
      },
      {
        id: 'fc-4',
        question: 'How does Dropout prevent neural network overfitting?',
        answer: 'By randomly zeroing out hidden neuron activations during training with probability p, forcing the network to learn redundant, robust feature representations.',
        difficulty: 'Medium',
        category: 'Regularization',
        reviewedCount: 2,
        lastRating: 'correct'
      },
      {
        id: 'fc-5',
        question: 'What is the mathematical role of Batch Normalization?',
        answer: 'It normalizes layer inputs to mean 0 and variance 1 across each mini-batch, stabilizing internal covariate shift and allowing higher learning rates.',
        difficulty: 'Hard',
        category: 'Optimization',
        reviewedCount: 1,
        lastRating: 'review'
      }
    ],
    actionPlan: {
      recommendation: {
        id: 'rec-1',
        title: 'AI Recommendation',
        description: 'Your pace is 15% faster than average. Consider skipping "Intro to Layers" and jumping into "Custom Loss Functions" to save 45 minutes.',
        actionText: 'Apply AI Schedule Optimization',
        timeSavedMinutes: 45
      },
      items: [
        {
          id: 'act-1',
          title: 'Gradient Descent Lab',
          estimatedMinutes: 45,
          priority: 'high',
          type: 'lab',
          completed: false,
          notes: 'Implement gradient descent in numpy for a 2-variable cost function.'
        },
        {
          id: 'act-2',
          title: 'Summary Draft: Backprop',
          estimatedMinutes: 20,
          priority: 'medium',
          type: 'draft',
          completed: false,
          notes: 'Write a 1-page intuitive summary of backward error propagation.'
        },
        {
          id: 'act-3',
          title: 'Module 3 Review Video',
          estimatedMinutes: 12,
          priority: 'low',
          type: 'video',
          completed: false,
          notes: 'Watch lecture recording on ReLU vs Leaky ReLU.'
        },
        {
          id: 'act-4',
          title: 'Adam Optimizer Mathematical Derivation',
          estimatedMinutes: 35,
          priority: 'high',
          type: 'reading',
          completed: false,
          notes: 'Read Kingma & Ba 2014 paper sections 2 and 3.'
        }
      ]
    }
  },
  'bp-econ': {
    id: 'bp-econ',
    title: 'ECON 101 Midterm Masterclass',
    subtitle: 'AI-Generated Blueprint • 10 Task Units',
    readinessScore: 82,
    createdAt: 'Yesterday at 04:15 PM',
    lastUpdated: 'Yesterday at 04:15 PM',
    syllabusText: SYLLABUS_TEMPLATES[1].briefText,
    weeklyTimeline: [
      {
        weekNumber: 1,
        totalWeeks: 3,
        title: 'Supply, Demand & Elasticity',
        statusText: 'Completed • 5.0 hrs total',
        status: 'completed',
        hoursTotal: 5.0,
        milestonesLeft: 0,
        milestones: [
          { id: 'e-101', title: 'Plot PPF curves and calculate opportunity costs', completed: true },
          { id: 'e-102', title: 'Solve equilibrium price shifts with simultaneous shifts', completed: true }
        ]
      },
      {
        weekNumber: 2,
        totalWeeks: 3,
        title: 'Surplus & Tax Incidence Lab',
        statusText: 'Active • 1 milestone left',
        status: 'active',
        hoursTotal: 4.5,
        milestonesLeft: 1,
        milestones: [
          { id: 'e-201', title: 'Calculate deadweight loss from a $5 excise tax', completed: true },
          { id: 'e-202', title: 'Compare tax burdens on elastic vs inelastic demand', completed: false }
        ]
      },
      {
        weekNumber: 3,
        totalWeeks: 3,
        title: 'Market Structures & Monopoly',
        statusText: 'Scheduled for Monday',
        status: 'scheduled',
        hoursTotal: 6.0,
        milestonesLeft: 3,
        milestones: [
          { id: 'e-301', title: 'Graph Marginal Revenue vs Marginal Cost curves', completed: false },
          { id: 'e-302', title: 'Identify profit maximization point for monopolies', completed: false },
          { id: 'e-303', title: 'Complete comprehensive midterm practice exam', completed: false }
        ]
      }
    ],
    criticalMilestones: [
      {
        id: 'ecm-1',
        title: 'Master Price Elasticity Formula',
        completed: true,
        category: 'core',
        aiTip: 'Use the midpoint method to avoid discrepancy between price increases and decreases.'
      },
      {
        id: 'ecm-2',
        title: 'Calculate deadweight loss triangle area',
        completed: false,
        category: 'lab',
        aiTip: 'Area = 0.5 * (tax per unit) * (change in equilibrium quantity traded).'
      },
      {
        id: 'ecm-3',
        title: 'Differentiate Monopoly MR vs Demand curve',
        completed: false,
        category: 'theory',
        aiTip: 'Remember that for a linear demand curve, the MR curve has twice the slope and the same price intercept.'
      }
    ],
    flashcards: [
      {
        id: 'efc-1',
        question: 'What is Opportunity Cost?',
        answer: 'The value of the next best alternative foregone when a choice or decision is made.',
        difficulty: 'Easy',
        category: 'Fundamentals',
        reviewedCount: 6,
        lastRating: 'correct'
      },
      {
        id: 'efc-2',
        question: 'If demand is inelastic (E < 1), how does a price increase affect Total Revenue?',
        answer: 'Total Revenue increases because the percentage drop in quantity demanded is smaller than the percentage increase in price.',
        difficulty: 'Medium',
        category: 'Elasticity',
        reviewedCount: 4,
        lastRating: 'correct'
      },
      {
        id: 'efc-3',
        question: 'Why does a monopoly produce less output than a competitive market?',
        answer: 'Because a monopolist produces where MR = MC, which occurs at a lower quantity and higher price than the competitive equilibrium where P = MC.',
        difficulty: 'Hard',
        category: 'Market Structures',
        reviewedCount: 2,
        lastRating: 'review'
      }
    ],
    actionPlan: {
      recommendation: {
        id: 'erec-1',
        title: 'AI Exam Strategy Insight',
        description: 'You have mastered consumer surplus formulas! Focus 70% of remaining study time on Monopoly deadweight loss graphs for the midterm.',
        actionText: 'Generate Monopoly Practice Quiz',
        timeSavedMinutes: 30
      },
      items: [
        {
          id: 'eact-1',
          title: 'Tax Incidence Calculation Worksheet',
          estimatedMinutes: 35,
          priority: 'high',
          type: 'lab',
          completed: false,
          notes: 'Solve 5 problems comparing excise tax on gasoline vs luxury goods.'
        },
        {
          id: 'eact-2',
          title: 'Read Chapter 7: Consumers & Producers',
          estimatedMinutes: 45,
          priority: 'medium',
          type: 'reading',
          completed: true,
          notes: 'Highlight welfare economics principles.'
        },
        {
          id: 'eact-3',
          title: 'Watch Game Theory Nash Equilibrium summary',
          estimatedMinutes: 15,
          priority: 'low',
          type: 'video',
          completed: false,
          notes: 'Optional extension for bonus paper.'
        }
      ]
    }
  },
  'bp-sysdesign': {
    id: 'bp-sysdesign',
    title: 'System Design Architecture Sprint',
    subtitle: 'AI-Generated Blueprint • 15 Task Units',
    readinessScore: 45,
    createdAt: '3 days ago',
    lastUpdated: '2 hours ago',
    syllabusText: SYLLABUS_TEMPLATES[2].briefText,
    weeklyTimeline: [
      {
        weekNumber: 1,
        totalWeeks: 3,
        title: 'Load Balancing & Caching',
        statusText: 'Active • 2 milestones left',
        status: 'active',
        hoursTotal: 8.0,
        milestonesLeft: 2,
        milestones: [
          { id: 'sd-101', title: 'Implement consistent hashing ring simulation', completed: true },
          { id: 'sd-102', title: 'Compare Redis cluster sharding vs Sentinel replication', completed: false },
          { id: 'sd-103', title: 'Design rate limiting middleware (Token Bucket)', completed: false }
        ]
      },
      {
        weekNumber: 2,
        totalWeeks: 3,
        title: 'Database Partitioning & CAP',
        statusText: 'Scheduled for next week',
        status: 'scheduled',
        hoursTotal: 10.0,
        milestonesLeft: 3,
        milestones: [
          { id: 'sd-201', title: 'Analyze CAP Theorem trade-offs in Cassandra vs DynamoDB', completed: false },
          { id: 'sd-202', title: 'Design database horizontal sharding scheme for 100M users', completed: false },
          { id: 'sd-203', title: 'Implement write-ahead log (WAL) durability check', completed: false }
        ]
      },
      {
        weekNumber: 3,
        totalWeeks: 3,
        title: 'Distributed Consensus & Messaging',
        statusText: 'Scheduled for Week 3',
        status: 'scheduled',
        hoursTotal: 9.0,
        milestonesLeft: 3,
        milestones: [
          { id: 'sd-301', title: 'Understand Raft leader election state machine', completed: false },
          { id: 'sd-302', title: 'Design event-driven order processing pipeline with Kafka', completed: false },
          { id: 'sd-303', title: 'Complete mock system design interview: Design Instagram', completed: false }
        ]
      }
    ],
    criticalMilestones: [
      {
        id: 'sdcm-1',
        title: 'Design rate limiting middleware',
        completed: false,
        category: 'lab',
        aiTip: 'Use a Redis sorted set or token bucket algorithm to ensure thread-safe atomic decrements under high concurrent request spikes.'
      },
      {
        id: 'sdcm-2',
        title: 'Master Consistent Hashing Ring',
        completed: true,
        category: 'core',
        aiTip: 'Virtual nodes (v-nodes) prevent data hot-spots when hardware server capacities differ.'
      },
      {
        id: 'sdcm-3',
        title: 'Explain CAP Theorem in interviews',
        completed: false,
        category: 'theory',
        aiTip: 'When a network partition (P) occurs, you must choose between consistency (C) or availability (A).'
      }
    ],
    flashcards: [
      {
        id: 'sdfc-1',
        question: 'What is Consistent Hashing and why is it useful?',
        answer: 'An algorithmic routing strategy where keys and servers are mapped to a circular hash ring. When a node is added or removed, only K/N keys need to be remapped.',
        difficulty: 'Medium',
        category: 'Load Balancing',
        reviewedCount: 4,
        lastRating: 'correct'
      },
      {
        id: 'sdfc-2',
        question: 'What is the difference between Write-Through and Write-Back caching?',
        answer: 'Write-Through writes synchronously to both cache and database (slower writes, safer). Write-Back writes only to cache first and asynchronously flushes to DB (fast writes, risk of data loss on crash).',
        difficulty: 'Hard',
        category: 'Caching',
        reviewedCount: 2,
        lastRating: 'review'
      },
      {
        id: 'sdfc-3',
        question: 'What is the Raft Consensus Protocol?',
        answer: 'A distributed consensus algorithm designed to manage a replicated state machine through leader election and log replication.',
        difficulty: 'Hard',
        category: 'Consensus',
        reviewedCount: 1,
        lastRating: 'review'
      }
    ],
    actionPlan: {
      recommendation: {
        id: 'sdrec-1',
        title: 'AI Architectural Advisor',
        description: 'Caching questions appear in 85% of system design interviews. Spend extra time analyzing Redis eviction policies (LRU vs LFU).',
        actionText: 'Review Redis Eviction Cheat Sheet',
        timeSavedMinutes: 60
      },
      items: [
        {
          id: 'sdact-1',
          title: 'Consistent Hashing Lab in Python/TS',
          estimatedMinutes: 50,
          priority: 'high',
          type: 'lab',
          completed: true,
          notes: 'Build a hash ring with virtual node support.'
        },
        {
          id: 'sdact-2',
          title: 'Watch Alex Xu: Design Twitter Architecture',
          estimatedMinutes: 30,
          priority: 'high',
          type: 'video',
          completed: false,
          notes: 'Focus on fan-out on write vs fan-out on read timelines.'
        },
        {
          id: 'sdact-3',
          title: 'Draft Schema for Uber Geohash Location Service',
          estimatedMinutes: 40,
          priority: 'medium',
          type: 'draft',
          completed: false,
          notes: 'Compare quadtrees vs geohash indexing.'
        }
      ]
    }
  }
};
