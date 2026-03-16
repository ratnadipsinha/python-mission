export type EditorMode = 'fill' | 'fix' | 'write';

export interface RefresherSection {
  heading: string;
  body: string;       // plain text explanation
  code?: string;      // optional code example
}

export interface Level {
  id: number;
  title: string;
  topic: string;
  emoji: string;
  rank: string;
  badge: string;
  xpReward: number;
  mode: EditorMode;
  instruction: string;
  starterCode: string;
  solution: string;
  hint: string;
  refresher: RefresherSection[];
  youtubeUrl: string;
  checkFn: (output: string, code: string) => boolean;
}

export const LEVELS: Level[] = [
  {
    id: 1,
    title: 'Say Hello!',
    topic: 'print()',
    emoji: '🌱',
    rank: 'Seedling',
    badge: 'First Words',
    xpReward: 50,
    mode: 'fill',
    instruction: `Welcome, young coder! 🌟\n\nYour first spell in Python is print() — it makes your program speak!\n\nTask: Make your program say exactly:\n  Hello, World!`,
    starterCode: `print("___")`,
    solution: `print("Hello, World!")`,
    hint: `Put Hello, World! inside the quotes. Exactly: print("Hello, World!")`,
    youtubeUrl: 'https://www.youtube.com/watch?v=2muFvgBlNSY&list=PLIQId4LTxIpAHNNJ24YruAhx8HFlovUSK',
    refresher: [
      {
        heading: '📢 What is print()?',
        body: 'print() is a built-in Python function that displays text on the screen. Whatever you put inside the brackets gets shown as output.',
        code: 'print("Hello, World!")',
      },
      {
        heading: '✏️ Syntax Rules',
        body: '• Always use round brackets ( )\n• Text must be inside quotes " " or \' \'\n• Python is case-sensitive — Print() won\'t work, only print()',
        code: 'print("I am learning Python!")\nprint(\'This works too!\')',
      },
      {
        heading: '💡 Did you know?',
        body: '"Hello, World!" is the very first program every programmer writes. It\'s a tradition going back to 1972!',
      },
    ],
    checkFn: (output) => output.trim() === 'Hello, World!',
  },
  {
    id: 2,
    title: 'Your Name Box',
    topic: 'Variables',
    emoji: '🔮',
    rank: 'Seedling',
    badge: 'Box Keeper',
    xpReward: 60,
    mode: 'fill',
    instruction: `A variable is like a magic box that holds information! 📦\n\nTask: Store your name in a variable called name, then print it.\n\nHint: name = "Alex"\nThen print the variable.`,
    starterCode: `name = "Alex"\nprint(___)`,
    solution: `name = "Alex"\nprint(name)`,
    hint: `To print a variable, don't use quotes. Try: print(name)`,
    youtubeUrl: 'https://www.youtube.com/watch?v=2muFvgBlNSY&list=PLIQId4LTxIpAHNNJ24YruAhx8HFlovUSK&index=2',
    refresher: [
      {
        heading: '📦 What is a Variable?',
        body: 'A variable is a named box that stores a value. You can put text, numbers, or other data inside it and use it later.',
        code: 'name = "Alex"\nage = 12\ncity = "London"',
      },
      {
        heading: '📝 Creating Variables',
        body: '• Use = to assign a value\n• Variable names can\'t have spaces (use _ instead)\n• Names are case-sensitive: Name ≠ name',
        code: 'my_name = "Jordan"\nfavourite_number = 7',
      },
      {
        heading: '🖨️ Printing Variables',
        body: 'To print a variable, just write its name inside print() WITHOUT quotes. Quotes would print the word literally!',
        code: 'name = "Alex"\nprint(name)    # prints: Alex\nprint("name")  # prints: name',
      },
    ],
    checkFn: (output) => output.trim().length > 0 && !output.includes('___'),
  },
  {
    id: 3,
    title: 'Math Wizard',
    topic: 'Math Operators',
    emoji: '🧮',
    rank: 'Explorer',
    badge: 'Calculator',
    xpReward: 70,
    mode: 'fill',
    instruction: `Python can do math for you! ➕➖✖️➗\n\nTask: Calculate 15 + 27 and print the result.\nThe answer should be 42.`,
    starterCode: `result = 15 + ___\nprint(result)`,
    solution: `result = 15 + 27\nprint(result)`,
    hint: `Fill in 27 to complete: result = 15 + 27`,
    youtubeUrl: 'https://www.youtube.com/watch?v=2muFvgBlNSY&list=PLIQId4LTxIpAHNNJ24YruAhx8HFlovUSK&index=3',
    refresher: [
      {
        heading: '🔢 Math Operators',
        body: '+ → Add\n- → Subtract\n* → Multiply\n/ → Divide\n** → Power (e.g. 2**3 = 8)\n% → Remainder (e.g. 10%3 = 1)',
        code: 'print(5 + 3)   # 8\nprint(10 - 4)  # 6\nprint(3 * 4)   # 12\nprint(15 / 2)  # 7.5',
      },
      {
        heading: '💾 Storing Results',
        body: 'You can save the result of a calculation into a variable, then use it later.',
        code: 'result = 15 + 27\nprint(result)  # 42',
      },
      {
        heading: '⚠️ Watch Out!',
        body: '/ always gives a decimal (float): 10/2 = 5.0\nUse // for whole number division: 10//2 = 5',
        code: 'print(10 / 2)   # 5.0\nprint(10 // 2)  # 5',
      },
    ],
    checkFn: (output) => output.trim() === '42',
  },
  {
    id: 4,
    title: 'Make a Choice',
    topic: 'if / else',
    emoji: '⚔️',
    rank: 'Squire',
    badge: 'Decision Maker',
    xpReward: 80,
    mode: 'fix',
    instruction: `The if/else spell lets your program make decisions! 🗡️\n\nThis code is BROKEN — fix it!\nIt should print "You are a teenager!" if age is 13, else print "Not a teenager!"`,
    starterCode: `age = 13\nif age == 13\n    print("You are a teenager!")\nelse:\n    print("Not a teenager!")`,
    solution: `age = 13\nif age == 13:\n    print("You are a teenager!")\nelse:\n    print("Not a teenager!")`,
    hint: `Look at line 2 — if statements need a colon : at the end!`,
    youtubeUrl: 'https://www.youtube.com/watch?v=2muFvgBlNSY&list=PLIQId4LTxIpAHNNJ24YruAhx8HFlovUSK&index=4',
    refresher: [
      {
        heading: '🤔 if / else — Making Decisions',
        body: 'if checks a condition. If it\'s True, the indented code runs. Otherwise, the else block runs.',
        code: 'if age >= 18:\n    print("Adult")\nelse:\n    print("Not an adult")',
      },
      {
        heading: '⚖️ Comparison Operators',
        body: '== → Equal to\n!= → Not equal\n>  → Greater than\n<  → Less than\n>= → Greater or equal\n<= → Less or equal',
        code: 'x = 10\nif x == 10:\n    print("x is ten!")',
      },
      {
        heading: '🔑 Critical Rules',
        body: '1. Always put a colon : after if and else\n2. The code inside MUST be indented (4 spaces)\n3. Use == to compare, not = (that\'s for assigning!)',
        code: 'if score > 50:      # ← colon!\n    print("Pass")  # ← 4 spaces indent',
      },
    ],
    checkFn: (output) => output.trim() === 'You are a teenager!',
  },
  {
    id: 5,
    title: 'Loop the Loop',
    topic: 'for loops',
    emoji: '🔄',
    rank: 'Squire',
    badge: 'Looper',
    xpReward: 90,
    mode: 'fix',
    instruction: `A for loop repeats code automatically! 🔁\n\nThis code is BROKEN — fix it!\nIt should print numbers 1 to 5, each on its own line.`,
    starterCode: `for i in range(1, 6):\nprint(i)`,
    solution: `for i in range(1, 6):\n    print(i)`,
    hint: `The print(i) line needs 4 spaces of indentation to be inside the loop!`,
    youtubeUrl: 'https://www.youtube.com/watch?v=2muFvgBlNSY&list=PLIQId4LTxIpAHNNJ24YruAhx8HFlovUSK&index=5',
    refresher: [
      {
        heading: '🔁 for Loops',
        body: 'A for loop repeats code a set number of times. The variable (like i) takes each value one by one.',
        code: 'for i in range(5):\n    print(i)\n# prints: 0 1 2 3 4',
      },
      {
        heading: '📐 range() Function',
        body: 'range(stop) → 0 to stop-1\nrange(start, stop) → start to stop-1\nrange(start, stop, step) → count by step',
        code: 'range(5)      # 0,1,2,3,4\nrange(1, 6)   # 1,2,3,4,5\nrange(0,10,2) # 0,2,4,6,8',
      },
      {
        heading: '🔑 Indentation is Everything!',
        body: 'Any code you want to repeat MUST be indented inside the loop. Without indentation, it runs only once after the loop ends.',
        code: 'for i in range(3):\n    print("Inside loop")  # repeats 3x\nprint("Outside loop")     # runs once',
      },
    ],
    checkFn: (output) => output.trim() === '1\n2\n3\n4\n5',
  },
  {
    id: 6,
    title: 'List Master',
    topic: 'Lists',
    emoji: '📋',
    rank: 'Warrior',
    badge: 'List Master',
    xpReward: 100,
    mode: 'write',
    instruction: `Lists hold many items in one variable! 🎒\n\nTask: Create a list of 3 fruits, then print each fruit using a for loop.\n\nExample output:\napple\nbanana\nmango`,
    starterCode: ``,
    solution: `fruits = ["apple", "banana", "mango"]\nfor fruit in fruits:\n    print(fruit)`,
    hint: `fruits = ["apple", "banana", "mango"]\nThen use: for fruit in fruits: print(fruit)`,
    youtubeUrl: 'https://www.youtube.com/watch?v=2muFvgBlNSY&list=PLIQId4LTxIpAHNNJ24YruAhx8HFlovUSK&index=6',
    refresher: [
      {
        heading: '📋 What is a List?',
        body: 'A list stores multiple values in one variable, in order. Items are separated by commas inside square brackets [ ].',
        code: 'fruits = ["apple", "banana", "mango"]\nnumbers = [1, 2, 3, 4, 5]',
      },
      {
        heading: '🔍 Accessing Items',
        body: 'Each item has an index starting at 0. Use [index] to get a specific item.',
        code: 'fruits = ["apple", "banana", "mango"]\nprint(fruits[0])  # apple\nprint(fruits[1])  # banana\nprint(fruits[2])  # mango',
      },
      {
        heading: '🔁 Looping a List',
        body: 'Use a for loop to go through every item in a list automatically.',
        code: 'for fruit in fruits:\n    print(fruit)',
      },
      {
        heading: '🛠️ Useful List Tools',
        body: 'len(list) → number of items\nlist.append(x) → add item\nlist.remove(x) → remove item',
        code: 'fruits.append("grape")\nprint(len(fruits))  # 4',
      },
    ],
    checkFn: (output, code) => {
      const lines = output.trim().split('\n');
      return lines.length === 3 && code.includes('[') && code.includes('for');
    },
  },
  {
    id: 7,
    title: 'String Magic',
    topic: 'String Methods',
    emoji: '✨',
    rank: 'Warrior',
    badge: 'Word Wizard',
    xpReward: 110,
    mode: 'fix',
    instruction: `Strings have magic powers — you can change them! 🪄\n\nThis code is BROKEN — fix it!\nIt should print "PYTHON IS FUN" in all capital letters.`,
    starterCode: `message = "python is fun"\nprint(message.upper)`,
    solution: `message = "python is fun"\nprint(message.upper())`,
    hint: `upper is a method — you need parentheses: message.upper()`,
    youtubeUrl: 'https://www.youtube.com/watch?v=2muFvgBlNSY&list=PLIQId4LTxIpAHNNJ24YruAhx8HFlovUSK&index=7',
    refresher: [
      {
        heading: '🔤 What is a String?',
        body: 'A string is any text stored in quotes. You can do lots of cool things with strings using methods (dot notation).',
        code: 'name = "python is fun"',
      },
      {
        heading: '🪄 String Methods',
        body: 'Methods are called with a dot . and always need () at the end.',
        code: 'text = "hello world"\nprint(text.upper())    # HELLO WORLD\nprint(text.lower())    # hello world\nprint(text.title())    # Hello World\nprint(text.replace("hello","hi"))  # hi world\nprint(len(text))       # 11',
      },
      {
        heading: '➕ Joining Strings',
        body: 'Use + to join (concatenate) two strings together.',
        code: 'first = "Python"\nsecond = " is fun"\nprint(first + second)  # Python is fun',
      },
      {
        heading: '⚠️ Common Mistake',
        body: 'Methods need () — without them Python thinks you\'re referring to the method itself, not calling it.',
        code: 'text.upper    # ❌ doesn\'t work\ntext.upper()  # ✅ correct',
      },
    ],
    checkFn: (output) => output.trim() === 'PYTHON IS FUN',
  },
  {
    id: 8,
    title: 'Spell Creator',
    topic: 'Functions',
    emoji: '🧙',
    rank: 'Champion',
    badge: 'Function Wizard',
    xpReward: 130,
    mode: 'write',
    instruction: `A function is your own reusable spell! 🧙\n\nTask: Write a function called greet that takes a name and prints:\n  Hello, [name]! Welcome to PyQuest!\n\nThen call it with your own name.`,
    starterCode: ``,
    solution: `def greet(name):\n    print("Hello, " + name + "! Welcome to PyQuest!")\n\ngreet("Alex")`,
    hint: `def greet(name):\n    print("Hello, " + name + "! Welcome to PyQuest!")`,
    youtubeUrl: 'https://www.youtube.com/watch?v=2muFvgBlNSY&list=PLIQId4LTxIpAHNNJ24YruAhx8HFlovUSK&index=8',
    refresher: [
      {
        heading: '🧙 What is a Function?',
        body: 'A function is a reusable block of code you give a name to. Write it once, use it many times!',
        code: 'def say_hello():\n    print("Hello!")\n\nsay_hello()  # call it\nsay_hello()  # call again',
      },
      {
        heading: '📥 Parameters',
        body: 'Parameters let you pass information INTO a function. They go inside the brackets.',
        code: 'def greet(name):\n    print("Hello, " + name)\n\ngreet("Alice")  # Hello, Alice\ngreet("Bob")    # Hello, Bob',
      },
      {
        heading: '🔑 Function Rules',
        body: '1. Start with def keyword\n2. Give it a name (no spaces)\n3. Put parameters in ( )\n4. End the line with :\n5. Indent the code inside\n6. Call it by name with ()',
        code: 'def add(a, b):\n    result = a + b\n    print(result)\n\nadd(3, 5)  # prints 8',
      },
    ],
    checkFn: (output) => output.includes('Hello,') && output.includes('Welcome to PyQuest!'),
  },
  {
    id: 9,
    title: 'Bug Slayer',
    topic: 'Debugging',
    emoji: '🐛',
    rank: 'Champion',
    badge: 'Bug Slayer',
    xpReward: 150,
    mode: 'fix',
    instruction: `A champion coder can find and fix bugs! 🐛➡️✅\n\nThis code has 3 bugs — find and fix all of them!\nIt should print the sum of a list: 15`,
    starterCode: `numbers = [1, 2, 3, 4, 5\ntotal = 0\nfor num in numbers\n    total = total + num\nprint("Sum:" total)`,
    solution: `numbers = [1, 2, 3, 4, 5]\ntotal = 0\nfor num in numbers:\n    total = total + num\nprint("Sum:", total)`,
    hint: `Bug 1: missing ] on line 1\nBug 2: missing : after for loop\nBug 3: missing comma in print("Sum:", total)`,
    youtubeUrl: 'https://www.youtube.com/watch?v=2muFvgBlNSY&list=PLIQId4LTxIpAHNNJ24YruAhx8HFlovUSK&index=9',
    refresher: [
      {
        heading: '🐛 What is a Bug?',
        body: 'A bug is an error in your code that stops it working correctly. Every programmer deals with bugs — fixing them is called debugging!',
      },
      {
        heading: '🔍 Types of Errors',
        body: 'SyntaxError → Bad spelling or missing punctuation (:, ], ,)\nIndentationError → Wrong spacing inside loops/functions\nNameError → Using a variable that doesn\'t exist\nTypeError → Mixing wrong types (e.g. number + text)',
        code: '# SyntaxError example:\nfor i in range(5)   # missing :\n\n# NameError example:\nprint(mesage)  # typo!',
      },
      {
        heading: '🛠️ Debugging Tips',
        body: '1. Read the error message — it tells you the line number\n2. Check for missing : at end of if/for/def\n3. Check bracket pairs [] () {}\n4. Check comma separators in print()\n5. Read each line slowly out loud',
      },
    ],
    checkFn: (output) => output.trim() === 'Sum: 15',
  },
  {
    id: 10,
    title: 'Dragon Tamer',
    topic: 'Mini Project',
    emoji: '🐉',
    rank: 'Python Master',
    badge: 'Dragon Tamer',
    xpReward: 200,
    mode: 'write',
    instruction: `FINAL CHALLENGE — Tame the Dragon! 🐉\n\nBuild a number guessing game:\n1. Set secret = 7\n2. Guess a number (set guess = any number)\n3. If guess equals secret → print "You tamed the dragon! 🐉"\n4. If guess is too low → print "Too low! Try higher!"\n5. If guess is too high → print "Too high! Try lower!"\n\nTest with guess = 7 to win!`,
    starterCode: ``,
    solution: `secret = 7\nguess = 7\n\nif guess == secret:\n    print("You tamed the dragon! 🐉")\nelif guess < secret:\n    print("Too low! Try higher!")\nelse:\n    print("Too high! Try lower!")`,
    hint: `Use if, elif, and else:\nif guess == secret:\nelif guess < secret:\nelse:`,
    youtubeUrl: 'https://www.youtube.com/watch?v=2muFvgBlNSY&list=PLIQId4LTxIpAHNNJ24YruAhx8HFlovUSK&index=10',
    refresher: [
      {
        heading: '🐉 Your Final Challenge',
        body: 'This project combines EVERYTHING you\'ve learned:\n• Variables (secret, guess)\n• if / elif / else for decisions\n• Comparison operators (==, <, >)\n• print() for output',
      },
      {
        heading: '🔀 if / elif / else',
        body: 'elif means "else if" — check another condition when the first one is False. You can chain as many elif as you need.',
        code: 'if guess == secret:\n    print("Correct!")\nelif guess < secret:\n    print("Too low!")\nelse:\n    print("Too high!")',
      },
      {
        heading: '📝 Project Plan',
        body: 'Step 1: Create secret = 7\nStep 2: Create guess = (a number)\nStep 3: Write if guess == secret\nStep 4: Write elif guess < secret\nStep 5: Write else\nStep 6: Add print() in each block\nStep 7: Test with guess = 7 (should win!)',
      },
      {
        heading: '🏆 You\'ve Learned',
        body: '✅ print()\n✅ Variables\n✅ Math operators\n✅ if / elif / else\n✅ for loops\n✅ Lists\n✅ String methods\n✅ Functions\n✅ Debugging\n\nYou are a Python coder! 🐍',
      },
    ],
    checkFn: (output) =>
      output.includes('tamed the dragon') ||
      output.includes('Too low') ||
      output.includes('Too high'),
  },
];

export const RANKS = [
  { name: 'Seedling',      emoji: '🌱', minXP: 0    },
  { name: 'Explorer',      emoji: '🔭', minXP: 100  },
  { name: 'Squire',        emoji: '🗡️', minXP: 200  },
  { name: 'Warrior',       emoji: '⚔️', minXP: 350  },
  { name: 'Champion',      emoji: '🏆', minXP: 550  },
  { name: 'Python Master', emoji: '🐉', minXP: 800  },
];

export function getRank(xp: number) {
  return [...RANKS].reverse().find(r => xp >= r.minXP) ?? RANKS[0];
}
