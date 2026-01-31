// Firebase Quiz Service
import { db, collection, addDoc, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit } from './firebase-config.js';

class FirebaseQuizService {
    constructor() {
        this.groqApiKey = 'your-groq-api-key'; // Replace with actual Groq API key
        this.groqApiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    }

    // Generate quiz questions using Groq AI
    async generateQuizQuestions(topic, difficulty = 'medium', count = 10) {
        try {
            const prompt = `Generate ${count} multiple choice questions about ${topic} for ${difficulty} level. 
            Format as JSON array with objects containing: question, options (array of 4 choices), correctAnswer (index 0-3), explanation.
            Topics should cover: ${this.getTopicDetails(topic)}`;

            const response = await fetch(this.groqApiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.groqApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'mixtral-8x7b-32768',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert IT interview question generator. Generate high-quality technical questions with accurate answers.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate questions');
            }

            const data = await response.json();
            const questionsText = data.choices[0].message.content;
            
            // Parse JSON from response
            const questions = JSON.parse(questionsText);
            
            return { success: true, questions };
        } catch (error) {
            console.error('Error generating questions:', error);
            // Fallback to default questions if AI fails
            return { success: true, questions: this.getDefaultQuestions(topic, difficulty) };
        }
    }

    // Get topic-specific details for better question generation
    getTopicDetails(topic) {
        const topicMap = {
            'programming': 'programming fundamentals, data types, control structures, functions, OOP concepts',
            'javascript': 'JavaScript syntax, DOM manipulation, async programming, ES6+ features, frameworks',
            'python': 'Python syntax, data structures, libraries, frameworks like Django/Flask',
            'java': 'Java syntax, OOP, collections, multithreading, Spring framework',
            'web-development': 'HTML, CSS, JavaScript, responsive design, web APIs, frameworks',
            'data-structures': 'arrays, linked lists, stacks, queues, trees, graphs, hash tables',
            'algorithms': 'sorting, searching, dynamic programming, recursion, complexity analysis',
            'system-design': 'scalability, load balancing, databases, caching, microservices',
            'databases': 'SQL, NoSQL, database design, indexing, transactions, normalization'
        };
        return topicMap[topic] || 'general IT and programming concepts';
    }

    // Fallback questions if AI generation fails
    getDefaultQuestions(topic, difficulty = 'beginner') {
        const questionBank = {
            'javascript': {
                'beginner': [
                    {
                        question: "How do you declare a variable in JavaScript?",
                        options: ["variable x", "var x", "declare x", "x variable"],
                        correctAnswer: 1,
                        explanation: "Variables in JavaScript are declared using 'var', 'let', or 'const' keywords."
                    },
                    {
                        question: "What is the correct way to write a JavaScript comment?",
                        options: ["<!-- comment -->", "// comment", "/* comment", "# comment"],
                        correctAnswer: 1,
                        explanation: "Single-line comments in JavaScript start with //"
                    },
                    {
                        question: "Which method is used to write text in the browser console?",
                        options: ["console.write()", "console.log()", "console.print()", "console.output()"],
                        correctAnswer: 1,
                        explanation: "console.log() is used to output text to the browser console."
                    },
                    {
                        question: "What is the correct way to create a function in JavaScript?",
                        options: ["function myFunction() {}", "create myFunction() {}", "def myFunction() {}", "function = myFunction() {}"],
                        correctAnswer: 0,
                        explanation: "Functions in JavaScript are created using the 'function' keyword."
                    },
                    {
                        question: "How do you call a function named 'myFunction'?",
                        options: ["call myFunction()", "myFunction()", "execute myFunction()", "run myFunction()"],
                        correctAnswer: 1,
                        explanation: "Functions are called by writing the function name followed by parentheses."
                    },
                    {
                        question: "What is the correct way to write an if statement in JavaScript?",
                        options: ["if i = 5", "if (i == 5)", "if i == 5 then", "if i equals 5"],
                        correctAnswer: 1,
                        explanation: "If statements in JavaScript use parentheses around the condition."
                    },
                    {
                        question: "Which operator is used to assign a value to a variable?",
                        options: ["*", "=", "x", "-"],
                        correctAnswer: 1,
                        explanation: "The = operator is used for assignment in JavaScript."
                    },
                    {
                        question: "What will typeof 'Hello' return?",
                        options: ["string", "text", "char", "word"],
                        correctAnswer: 0,
                        explanation: "The typeof operator returns 'string' for string values."
                    },
                    {
                        question: "How do you create an array in JavaScript?",
                        options: ["var arr = []", "var arr = {}", "var arr = ()", "var arr = <>"],
                        correctAnswer: 0,
                        explanation: "Arrays in JavaScript are created using square brackets []."
                    },
                    {
                        question: "What is the correct way to access the first element of an array?",
                        options: ["arr[1]", "arr[0]", "arr.first", "arr(0)"],
                        correctAnswer: 1,
                        explanation: "Array indexing in JavaScript starts at 0, so the first element is arr[0]."
                    },
                    {
                        question: "Which method adds an element to the end of an array?",
                        options: ["add()", "push()", "append()", "insert()"],
                        correctAnswer: 1,
                        explanation: "The push() method adds elements to the end of an array."
                    },
                    {
                        question: "What does the length property of an array return?",
                        options: ["The last element", "The number of elements", "The first element", "The array type"],
                        correctAnswer: 1,
                        explanation: "The length property returns the number of elements in an array."
                    },
                    {
                        question: "How do you write a for loop in JavaScript?",
                        options: ["for (i = 0; i < 5; i++)", "for i = 1 to 5", "for (i <= 5; i++)", "for i in range(5)"],
                        correctAnswer: 0,
                        explanation: "For loops in JavaScript use the syntax: for (initialization; condition; increment)."
                    },
                    {
                        question: "What is the correct way to write a while loop?",
                        options: ["while i = 1 to 10", "while (i <= 10)", "while i <= 10", "while (i <= 10) do"],
                        correctAnswer: 1,
                        explanation: "While loops in JavaScript use parentheses around the condition."
                    },
                    {
                        question: "Which method converts a string to lowercase?",
                        options: ["toLowerCase()", "lower()", "lowerCase()", "toLower()"],
                        correctAnswer: 0,
                        explanation: "The toLowerCase() method converts a string to lowercase letters."
                    },
                    {
                        question: "What does the parseInt() function do?",
                        options: ["Converts to string", "Converts string to integer", "Parses HTML", "Creates integer"],
                        correctAnswer: 1,
                        explanation: "parseInt() converts a string to an integer."
                    },
                    {
                        question: "How do you check if a variable is undefined?",
                        options: ["if (x == undefined)", "if (x === undefined)", "if (undefined(x))", "if (x.undefined)"],
                        correctAnswer: 1,
                        explanation: "Use === undefined to check if a variable is undefined."
                    },
                    {
                        question: "What is the result of 5 + '5' in JavaScript?",
                        options: ["10", "'55'", "Error", "NaN"],
                        correctAnswer: 1,
                        explanation: "JavaScript performs string concatenation when one operand is a string, resulting in '55'."
                    },
                    {
                        question: "Which keyword is used to declare a constant?",
                        options: ["var", "let", "const", "constant"],
                        correctAnswer: 2,
                        explanation: "The 'const' keyword is used to declare constants in JavaScript."
                    },
                    {
                        question: "What is the correct way to create an object in JavaScript?",
                        options: ["var obj = []", "var obj = {}", "var obj = ()", "var obj = new Object"],
                        correctAnswer: 1,
                        explanation: "Objects in JavaScript are created using curly braces {} or the Object constructor."
                    }
                ],
                'easy': [
                    {
                        question: "What does 'this' keyword refer to in JavaScript?",
                        options: ["The global object", "The current function", "The calling object", "The parent object"],
                        correctAnswer: 2,
                        explanation: "'this' refers to the object that is calling the function, which can vary depending on how the function is invoked."
                    },
                    {
                        question: "What is the difference between '==' and '===' in JavaScript?",
                        options: ["No difference", "== checks type, === checks value", "== checks value, === checks value and type", "=== is faster"],
                        correctAnswer: 2,
                        explanation: "== performs type coercion and checks value, while === checks both value and type without coercion."
                    },
                    {
                        question: "What is hoisting in JavaScript?",
                        options: ["Moving code up", "Variable and function declarations are moved to the top", "Lifting objects", "Code optimization"],
                        correctAnswer: 1,
                        explanation: "Hoisting is JavaScript's behavior of moving variable and function declarations to the top of their scope."
                    },
                    {
                        question: "What is a closure in JavaScript?",
                        options: ["A loop", "A function with access to outer scope variables", "A data type", "A method"],
                        correctAnswer: 1,
                        explanation: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function returns."
                    },
                    {
                        question: "What is the difference between 'let' and 'var'?",
                        options: ["No difference", "let has block scope, var has function scope", "var is newer", "let is faster"],
                        correctAnswer: 1,
                        explanation: "'let' has block scope while 'var' has function scope, and 'let' doesn't allow redeclaration."
                    },
                    {
                        question: "What is event bubbling?",
                        options: ["Events moving from child to parent", "Events moving from parent to child", "Creating events", "Removing events"],
                        correctAnswer: 0,
                        explanation: "Event bubbling is when events propagate from the target element up through its ancestors."
                    },
                    {
                        question: "What is the purpose of the 'use strict' directive?",
                        options: ["Makes code faster", "Enables strict mode for better error checking", "Compresses code", "Adds security"],
                        correctAnswer: 1,
                        explanation: "'use strict' enables strict mode, which catches common coding mistakes and prevents certain actions."
                    },
                    {
                        question: "What is the difference between null and undefined?",
                        options: ["No difference", "null is assigned, undefined is default", "undefined is assigned, null is default", "null is a string"],
                        correctAnswer: 1,
                        explanation: "null is an assigned value representing 'no value', while undefined means a variable has been declared but not assigned."
                    },
                    {
                        question: "What is a callback function?",
                        options: ["A function that calls back", "A function passed as argument to another function", "A recursive function", "A built-in function"],
                        correctAnswer: 1,
                        explanation: "A callback function is a function passed as an argument to another function to be executed later."
                    },
                    {
                        question: "What is the purpose of JSON.stringify()?",
                        options: ["Parse JSON", "Convert object to JSON string", "Validate JSON", "Format JSON"],
                        correctAnswer: 1,
                        explanation: "JSON.stringify() converts a JavaScript object into a JSON string."
                    },
                    {
                        question: "What is the purpose of JSON.parse()?",
                        options: ["Convert JSON string to object", "Stringify object", "Validate JSON", "Format JSON"],
                        correctAnswer: 0,
                        explanation: "JSON.parse() converts a JSON string into a JavaScript object."
                    },
                    {
                        question: "What is the difference between function declaration and function expression?",
                        options: ["No difference", "Declaration is hoisted, expression is not", "Expression is faster", "Declaration is newer"],
                        correctAnswer: 1,
                        explanation: "Function declarations are hoisted and can be called before they're defined, while function expressions are not hoisted."
                    },
                    {
                        question: "What is the spread operator in JavaScript?",
                        options: ["...", "++", "**", "//"],
                        correctAnswer: 0,
                        explanation: "The spread operator (...) allows an iterable to be expanded in places where multiple elements are expected."
                    },
                    {
                        question: "What is destructuring in JavaScript?",
                        options: ["Breaking code", "Extracting values from arrays/objects", "Removing elements", "Error handling"],
                        correctAnswer: 1,
                        explanation: "Destructuring allows extracting values from arrays or properties from objects into distinct variables."
                    },
                    {
                        question: "What is the purpose of the map() method?",
                        options: ["Filter array", "Create new array by transforming each element", "Find element", "Sort array"],
                        correctAnswer: 1,
                        explanation: "The map() method creates a new array by calling a function on every element of the original array."
                    },
                    {
                        question: "What is the purpose of the filter() method?",
                        options: ["Transform elements", "Create new array with elements that pass a test", "Sort elements", "Find element"],
                        correctAnswer: 1,
                        explanation: "The filter() method creates a new array with elements that pass a test implemented by a provided function."
                    },
                    {
                        question: "What is the purpose of the reduce() method?",
                        options: ["Filter array", "Reduce array to single value", "Sort array", "Map array"],
                        correctAnswer: 1,
                        explanation: "The reduce() method executes a reducer function on each element, resulting in a single output value."
                    },
                    {
                        question: "What is a Promise in JavaScript?",
                        options: ["A guarantee", "An object representing eventual completion of async operation", "A function", "A variable"],
                        correctAnswer: 1,
                        explanation: "A Promise is an object representing the eventual completion or failure of an asynchronous operation."
                    },
                    {
                        question: "What are the three states of a Promise?",
                        options: ["start, middle, end", "pending, fulfilled, rejected", "new, running, done", "init, process, complete"],
                        correctAnswer: 1,
                        explanation: "A Promise has three states: pending (initial), fulfilled (completed successfully), and rejected (failed)."
                    },
                    {
                        question: "What is async/await?",
                        options: ["A loop", "Syntactic sugar for Promises", "A data type", "An operator"],
                        correctAnswer: 1,
                        explanation: "async/await is syntactic sugar that makes it easier to work with Promises in a more synchronous-looking way."
                    }
                ]
            },
            'databases': {
                'beginner': [
                    {
                        question: "What does SQL stand for?",
                        options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "System Query Language"],
                        correctAnswer: 0,
                        explanation: "SQL stands for Structured Query Language."
                    },
                    {
                        question: "Which command is used to retrieve data from a database?",
                        options: ["GET", "SELECT", "RETRIEVE", "FETCH"],
                        correctAnswer: 1,
                        explanation: "SELECT is used to retrieve data from a database."
                    },
                    {
                        question: "What is a primary key?",
                        options: ["A key that opens the database", "A unique identifier for each record", "The first column in a table", "A password for the database"],
                        correctAnswer: 1,
                        explanation: "A primary key is a unique identifier for each record in a table."
                    },
                    {
                        question: "Which command is used to add new data to a table?",
                        options: ["ADD", "INSERT", "CREATE", "PUT"],
                        correctAnswer: 1,
                        explanation: "INSERT is used to add new data to a table."
                    },
                    {
                        question: "What is a foreign key?",
                        options: ["A key from another country", "A key that references another table's primary key", "A backup key", "An encrypted key"],
                        correctAnswer: 1,
                        explanation: "A foreign key is a field that references the primary key of another table."
                    },
                    {
                        question: "Which command is used to modify existing data?",
                        options: ["MODIFY", "CHANGE", "UPDATE", "ALTER"],
                        correctAnswer: 2,
                        explanation: "UPDATE is used to modify existing data in a table."
                    },
                    {
                        question: "What does CRUD stand for?",
                        options: ["Create, Read, Update, Delete", "Copy, Read, Update, Delete", "Create, Retrieve, Update, Delete", "Create, Read, Upload, Delete"],
                        correctAnswer: 0,
                        explanation: "CRUD stands for Create, Read, Update, Delete - the basic database operations."
                    },
                    {
                        question: "Which command is used to remove data from a table?",
                        options: ["REMOVE", "DELETE", "DROP", "CLEAR"],
                        correctAnswer: 1,
                        explanation: "DELETE is used to remove data from a table."
                    },
                    {
                        question: "What is a database table?",
                        options: ["A physical table", "A collection of related data organized in rows and columns", "A type of chair", "A database command"],
                        correctAnswer: 1,
                        explanation: "A database table is a collection of related data organized in rows and columns."
                    },
                    {
                        question: "What is a database record?",
                        options: ["A music album", "A single row of data in a table", "A database backup", "A database log"],
                        correctAnswer: 1,
                        explanation: "A database record is a single row of data in a table."
                    },
                    {
                        question: "What is a database field?",
                        options: ["A grassy area", "A single column in a table", "A database error", "A database type"],
                        correctAnswer: 1,
                        explanation: "A database field is a single column in a table that stores a specific type of data."
                    },
                    {
                        question: "What is normalization in databases?",
                        options: ["Making data normal", "Organizing data to reduce redundancy", "Backing up data", "Encrypting data"],
                        correctAnswer: 1,
                        explanation: "Normalization is the process of organizing data to reduce redundancy and improve data integrity."
                    },
                    {
                        question: "What is an index in a database?",
                        options: ["A book index", "A data structure that improves query performance", "A database backup", "A database user"],
                        correctAnswer: 1,
                        explanation: "An index is a data structure that improves the speed of data retrieval operations."
                    },
                    {
                        question: "What does RDBMS stand for?",
                        options: ["Relational Database Management System", "Remote Database Management System", "Rapid Database Management System", "Real Database Management System"],
                        correctAnswer: 0,
                        explanation: "RDBMS stands for Relational Database Management System."
                    },
                    {
                        question: "What is a database schema?",
                        options: ["A database plan", "The structure and organization of a database", "A database backup", "A database query"],
                        correctAnswer: 1,
                        explanation: "A database schema defines the structure and organization of a database."
                    },
                    {
                        question: "What is a JOIN in SQL?",
                        options: ["Connecting to database", "Combining data from multiple tables", "Adding new tables", "Deleting tables"],
                        correctAnswer: 1,
                        explanation: "A JOIN is used to combine data from multiple tables based on related columns."
                    },
                    {
                        question: "What is a NULL value?",
                        options: ["Zero", "Empty string", "Absence of a value", "False"],
                        correctAnswer: 2,
                        explanation: "NULL represents the absence of a value or unknown data."
                    },
                    {
                        question: "What is a database transaction?",
                        options: ["A database purchase", "A sequence of database operations treated as a single unit", "A database backup", "A database error"],
                        correctAnswer: 1,
                        explanation: "A transaction is a sequence of database operations that are treated as a single unit of work."
                    },
                    {
                        question: "What does ACID stand for in databases?",
                        options: ["Atomicity, Consistency, Isolation, Durability", "Access, Control, Identity, Data", "Add, Create, Insert, Delete", "Automatic, Consistent, Integrated, Distributed"],
                        correctAnswer: 0,
                        explanation: "ACID stands for Atomicity, Consistency, Isolation, and Durability - properties of database transactions."
                    },
                    {
                        question: "What is a database view?",
                        options: ["Looking at the database", "A virtual table based on a query", "A database window", "A database report"],
                        correctAnswer: 1,
                        explanation: "A view is a virtual table that is based on the result of a SQL query."
                    }
                ]
            },
            'programming': {
                'beginner': [
                    {
                        question: "What is a variable in programming?",
                        options: ["A fixed value", "A storage location with a name", "A function", "A loop"],
                        correctAnswer: 1,
                        explanation: "A variable is a storage location with an associated name that contains data."
                    },
                    {
                        question: "Which of the following is a programming language?",
                        options: ["HTML", "CSS", "Python", "JSON"],
                        correctAnswer: 2,
                        explanation: "Python is a programming language, while HTML and CSS are markup languages."
                    },
                    {
                        question: "What does IDE stand for?",
                        options: ["Internet Development Environment", "Integrated Development Environment", "Internal Data Exchange", "Interactive Design Editor"],
                        correctAnswer: 1,
                        explanation: "IDE stands for Integrated Development Environment."
                    },
                    {
                        question: "What is debugging?",
                        options: ["Writing code", "Finding and fixing errors", "Compiling code", "Testing software"],
                        correctAnswer: 1,
                        explanation: "Debugging is the process of finding and fixing errors in code."
                    },
                    {
                        question: "What is an algorithm?",
                        options: ["A programming language", "A step-by-step procedure", "A data type", "A compiler"],
                        correctAnswer: 1,
                        explanation: "An algorithm is a step-by-step procedure for solving a problem."
                    },
                    {
                        question: "What is syntax in programming?",
                        options: ["The meaning of code", "The rules for writing code", "The speed of execution", "The memory usage"],
                        correctAnswer: 1,
                        explanation: "Syntax refers to the rules and structure for writing code in a programming language."
                    },
                    {
                        question: "What is a loop?",
                        options: ["A data type", "A repeated execution of code", "A variable", "A function"],
                        correctAnswer: 1,
                        explanation: "A loop is a programming construct that repeats a block of code."
                    },
                    {
                        question: "What is a function?",
                        options: ["A variable", "A reusable block of code", "A data type", "A loop"],
                        correctAnswer: 1,
                        explanation: "A function is a reusable block of code that performs a specific task."
                    },
                    {
                        question: "What is a comment in code?",
                        options: ["Executable code", "Non-executable text for documentation", "A variable", "A function"],
                        correctAnswer: 1,
                        explanation: "Comments are non-executable text used to document and explain code."
                    },
                    {
                        question: "What is compilation?",
                        options: ["Running code", "Converting source code to machine code", "Debugging", "Testing"],
                        correctAnswer: 1,
                        explanation: "Compilation is the process of converting source code into machine code."
                    },
                    {
                        question: "What is an interpreter?",
                        options: ["A compiler", "A program that executes code line by line", "A debugger", "An IDE"],
                        correctAnswer: 1,
                        explanation: "An interpreter executes code line by line without prior compilation."
                    },
                    {
                        question: "What is a data type?",
                        options: ["A function", "A classification of data", "A loop", "A variable name"],
                        correctAnswer: 1,
                        explanation: "A data type defines the kind of data a variable can hold."
                    },
                    {
                        question: "What is pseudocode?",
                        options: ["Real programming code", "Algorithm written in plain language", "Compiled code", "Machine code"],
                        correctAnswer: 1,
                        explanation: "Pseudocode is an algorithm written in plain language before actual coding."
                    },
                    {
                        question: "What is a constant?",
                        options: ["A changing value", "A fixed value that cannot be changed", "A function", "A loop"],
                        correctAnswer: 1,
                        explanation: "A constant is a value that cannot be changed during program execution."
                    },
                    {
                        question: "What is source code?",
                        options: ["Machine code", "Human-readable code written by programmers", "Compiled code", "Binary code"],
                        correctAnswer: 1,
                        explanation: "Source code is human-readable code written by programmers."
                    },
                    {
                        question: "What is a bug in programming?",
                        options: ["A feature", "An error or flaw in code", "A comment", "A variable"],
                        correctAnswer: 1,
                        explanation: "A bug is an error or flaw in code that causes incorrect behavior."
                    },
                    {
                        question: "What is flowchart?",
                        options: ["A programming language", "A visual representation of algorithm", "A data type", "A function"],
                        correctAnswer: 1,
                        explanation: "A flowchart is a visual representation of an algorithm or process."
                    },
                    {
                        question: "What is input in programming?",
                        options: ["Output data", "Data provided to a program", "A function", "A loop"],
                        correctAnswer: 1,
                        explanation: "Input is data provided to a program for processing."
                    },
                    {
                        question: "What is output in programming?",
                        options: ["Input data", "Result produced by a program", "A variable", "A function"],
                        correctAnswer: 1,
                        explanation: "Output is the result or data produced by a program."
                    },
                    {
                        question: "What is a programming paradigm?",
                        options: ["A bug", "A style or approach to programming", "A data type", "A compiler"],
                        correctAnswer: 1,
                        explanation: "A programming paradigm is a style or approach to programming and problem-solving."
                    }
                ]
            }
        };
        
        const topicQuestions = questionBank[topic];
        if (!topicQuestions) {
            return this.shuffleArray(questionBank['programming']['beginner']).slice(0, 10);
        }
        
        const difficultyQuestions = topicQuestions[difficulty];
        if (!difficultyQuestions) {
            return this.shuffleArray(topicQuestions['beginner'] || questionBank['programming']['beginner']).slice(0, 10);
        }
        
        return this.shuffleArray(difficultyQuestions).slice(0, 10);
    }

    // Shuffle array to randomize questions
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Save quiz attempt to Firestore
    async saveQuizAttempt(userId, quizData) {
        try {
            const attemptData = {
                userId: userId,
                topic: quizData.topic,
                questions: quizData.questions,
                answers: quizData.answers,
                score: quizData.score,
                totalQuestions: quizData.totalQuestions,
                percentage: Math.round((quizData.score / quizData.totalQuestions) * 100),
                timeSpent: quizData.timeSpent || 0,
                completedAt: new Date().toISOString()
            };

            const docRef = await addDoc(collection(db, 'quizAttempts'), attemptData);
            
            // Update user stats
            await this.updateUserStats(userId, attemptData);
            
            return { success: true, attemptId: docRef.id };
        } catch (error) {
            console.error('Error saving quiz attempt:', error);
            return { success: false, message: 'Failed to save quiz results' };
        }
    }

    // Update user statistics
    async updateUserStats(userId, attemptData) {
        try {
            const userRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const newQuizCount = (userData.quizzesTaken || 0) + 1;
                const newTotalScore = (userData.totalScore || 0) + attemptData.score;
                const newAverageScore = Math.round((newTotalScore / newQuizCount) * 100) / 100;

                await setDoc(userRef, {
                    ...userData,
                    quizzesTaken: newQuizCount,
                    totalScore: newTotalScore,
                    averageScore: newAverageScore,
                    lastQuizDate: attemptData.completedAt
                });
            }
        } catch (error) {
            console.error('Error updating user stats:', error);
        }
    }

    // Get user's quiz history
    async getUserQuizHistory(userId, limitCount = 10) {
        try {
            const q = query(
                collection(db, 'quizAttempts'),
                where('userId', '==', userId),
                orderBy('completedAt', 'desc'),
                limit(limitCount)
            );
            
            const querySnapshot = await getDocs(q);
            const attempts = [];
            
            querySnapshot.forEach((doc) => {
                attempts.push({ id: doc.id, ...doc.data() });
            });
            
            return { success: true, attempts };
        } catch (error) {
            console.error('Error getting quiz history:', error);
            return { success: false, attempts: [] };
        }
    }

    // Get quiz statistics for a user
    async getUserStats(userId) {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                return {
                    success: true,
                    stats: {
                        quizzesTaken: userData.quizzesTaken || 0,
                        averageScore: userData.averageScore || 0,
                        totalScore: userData.totalScore || 0,
                        lastQuizDate: userData.lastQuizDate || null
                    }
                };
            }
            
            return { success: false, stats: null };
        } catch (error) {
            console.error('Error getting user stats:', error);
            return { success: false, stats: null };
        }
    }

    // Get available quiz topics
    getAvailableTopics() {
        return [
            { id: 'programming', name: 'Programming Fundamentals', icon: 'fas fa-code' },
            { id: 'javascript', name: 'JavaScript', icon: 'fab fa-js-square' },
            { id: 'python', name: 'Python', icon: 'fab fa-python' },
            { id: 'java', name: 'Java', icon: 'fab fa-java' },
            { id: 'web-development', name: 'Web Development', icon: 'fas fa-globe' },
            { id: 'data-structures', name: 'Data Structures', icon: 'fas fa-project-diagram' },
            { id: 'algorithms', name: 'Algorithms', icon: 'fas fa-brain' },
            { id: 'system-design', name: 'System Design', icon: 'fas fa-sitemap' },
            { id: 'databases', name: 'Databases', icon: 'fas fa-database' }
        ];
    }
}

// Create and export singleton instance
export const quizService = new FirebaseQuizService();