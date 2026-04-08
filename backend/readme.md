Lc-Major project
Day 1 
npm init -y  package.json
npm i express package-lock.json

express require >> server instance >> app.listen

>> reuquire dotenv.config .env global bhahar  jaha v server.js hoga  wahi .env v hoga  rkhna pdega 
>> nodemon install kro 
>> mongose install kro 
>>>connection establish kro cluster last m likhne se cluster ka naam phir index.js m import kr lo  
>>express ka instance create ho gya 
>>npm i cokkie parser 
>> db export krk ui set krk main call kro usme app.listen call kro take connetion chlne lage 
>>model user require mongose then usme se schema then new schema  rest of the comment is given there 

Chat summary — brief report (Hinglish)
1. Pehli problem: Local Judge0 + “Reference solution failed”
Symptom: Python submit pe API se status 13 (Internal Error), message /box/script.py / No such file.

Asli reason: Tumhara Node code sahi tha. Worker logs ne clear kiya: pehle Failed to create control group /sys/fs/cgroup/memory/box-N/, phir chown: cannot access '/box'. Matlab isolate sandbox ban hi nahi pa raha tha — cgroup issue. script.py error usi ka side effect tha (box bana nahi, file likhi nahi).

Environment: Windows + Docker Desktop — yahan cgroup v2 common hai, Judge0 purana cgroup v1 memory path expect karta hai. privileged: true official compose mein already sahi tha; phir bhi aksar Windows Docker pe poora fix nahi milta.

Solve direction (infra): Linux VM/VPS, kernel/cgroup settings (native Linux), ya hosted Judge0 / fork jo cgroup v2 support kare. Sirf language change (Python → Java etc.) se fix nahi — sab languages same sandbox se guzarti hain.

2. Dusri problem: Hosted Judge0 — token aa rahe, response nahi / hang
Symptom: Batch POST ok, tokens mil gaye, lekin request khatam nahi ho rahi / testResults log nahi.

Asli reason: Polling loop mein condition thi status.id > 3. Judge0 pe Accepted = 3. Jab sab pass ho, 3 > 3 false rehta hai → infinite loop.

Solve (code): “Done” tab maana jab status.id > 2 (ya status_id fallback), taaki Accepted (3) bhi terminal state maana jaye. X-Judge0-Region header POST + GET dono pe (default EU) taaki CE pe region mismatch / null batch issue kam ho. fetchData error pe throw taaki silent undefined na ho.

3. Teesri problem: Problem create pe Mongoose validation error
Symptom: "Path intialcode is required" — JSON mein initialcode tha.

Asli reason: Schema mein typo intialcode tha, API initialcode bhej rahi thi — field match nahi.

Solve (code): problem.js mein initialcode (sahi spelling). Bonus: invisibltestCases → invisibletestCases taaki body ke saath match ho.

4. Extra cheezein jo chat mein aayi
Gemini prompt: Judge0 + cgroup + Windows + logs wala context de kar fix / alternatives maangne ke liye ready-made English prompt diya tha.
Security note: Terminal logs mein password dikh sakta hai — rotate karo, production mein sensitive logs mat chhodo.
Ek table (seedha recap)
Topic	Problem	Fix
Local Judge0	Cgroup/sandbox fail → Internal Error 13	Infra: Linux / cgroup / hosted API — app code se nahi
Hosted polling	> 3 ne Accepted (3) ko kabhi “done” nahi maana	> 2 + region header + error throw
DB save	Schema typo intialcode	initialcode + invisibletestCases spelling
Bottom line: Pehle Judge0 server/cgroup samjha, phir polling logic ka bug fix hua, phir Mongoose field names API ke saath align kiye — teen alag layers, teen alag solutions.

///cursor chat 
bhai tune code m ky changes krey mujhe thk se smjhyega ek bari 

node (1-136)
 

{

  "title": "Sum of Two Numbers",

  "description": "Given two numbers, return their sum.",

  "difficulty": "easy",

  "tags": "arrays",



  "visibletestCases": [

    {

      "input": "2 3",

      "output": "5",

      "explanation": "2 + 3 = 5"

    },

    {

      "input": "10 20",

      "output": "30",

      "explanation": "10 + 20 = 30"

    }

  ],



  "invisibletestCases": [

    {

      "input": "100 200",

      "output": "300",

      "explanation": "Hidden test case"

    }

  ],



  "startcode": [

    {

      "language": "python",

      "initialcode": "a, b = map(int, input().split())\n# write your logic here"

    }

  ],



  "referenceSolution": [

    {

      "language": "python",

      "initialcode": "a, b = map(int, input().split())\nprint(a + b)"

    }

  ]

}



{

    "message": "Error creating problem problem validation failed: startcode.0.intialcode: Path `intialcode` is required., referenceSolution.0.intialcode: Path `intialcode` is required."

}

Kyon error aa raha tha
Mongoose schema mein field ka naam galat spell tha:

Schema (pehle)	Tumhari JSON
intialcode (typo — i missing)	initialcode
Mongoose ko initialcode dikhta hi nahi tha, isliye usne socha intialcode missing hai → "Path intialcode is required".

Judge0 / Python run theek tha (status_id: 3); fail new Problem({ ...req.body }).save() pe ho raha tha.

Maine kya change kiya (src/models/problem.js)
startcode aur referenceSolution dono ke andar intialcode → initialcode
Bonus: invisibltestCases → invisibletestCases taaki tumhari body ka invisibletestCases DB schema se match kare (warna woh field save hi nahi hoti / strict mode mein issue ho sakta tha)
Ab wahi JSON dubara bhejna chahiye chal jana. Purane DB documents agar intialcode key ke saath save hue hon to unhe migrate karna padega ya naye problems create karo — naye saves ab initialcode pe honge.

bhai iss pure chat m hamne jo jo bat kri hai uski puri ek brief report bna de sari probleams and usko kaise solve krri in hinglish 

Chat summary — brief report (Hinglish)
1. Pehli problem: Local Judge0 + “Reference solution failed”
Symptom: Python submit pe API se status 13 (Internal Error), message /box/script.py / No such file.

Asli reason: Tumhara Node code sahi tha. Worker logs ne clear kiya: pehle Failed to create control group /sys/fs/cgroup/memory/box-N/, phir chown: cannot access '/box'. Matlab isolate sandbox ban hi nahi pa raha tha — cgroup issue. script.py error usi ka side effect tha (box bana nahi, file likhi nahi).

Environment: Windows + Docker Desktop — yahan cgroup v2 common hai, Judge0 purana cgroup v1 memory path expect karta hai. privileged: true official compose mein already sahi tha; phir bhi aksar Windows Docker pe poora fix nahi milta.

Solve direction (infra): Linux VM/VPS, kernel/cgroup settings (native Linux), ya hosted Judge0 / fork jo cgroup v2 support kare. Sirf language change (Python → Java etc.) se fix nahi — sab languages same sandbox se guzarti hain.

2. Dusri problem: Hosted Judge0 — token aa rahe, response nahi / hang
Symptom: Batch POST ok, tokens mil gaye, lekin request khatam nahi ho rahi / testResults log nahi.

Asli reason: Polling loop mein condition thi status.id > 3. Judge0 pe Accepted = 3. Jab sab pass ho, 3 > 3 false rehta hai → infinite loop.

Solve (code): “Done” tab maana jab status.id > 2 (ya status_id fallback), taaki Accepted (3) bhi terminal state maana jaye. X-Judge0-Region header POST + GET dono pe (default EU) taaki CE pe region mismatch / null batch issue kam ho. fetchData error pe throw taaki silent undefined na ho.

3. Teesri problem: Problem create pe Mongoose validation error
Symptom: "Path intialcode is required" — JSON mein initialcode tha.

Asli reason: Schema mein typo intialcode tha, API initialcode bhej rahi thi — field match nahi.

Solve (code): problem.js mein initialcode (sahi spelling). Bonus: invisibltestCases → invisibletestCases taaki body ke saath match ho.

4. Extra cheezein jo chat mein aayi
Gemini prompt: Judge0 + cgroup + Windows + logs wala context de kar fix / alternatives maangne ke liye ready-made English prompt diya tha.
Security note: Terminal logs mein password dikh sakta hai — rotate karo, production mein sensitive logs mat chhodo.
Ek table (seedha recap)
Topic	Problem	Fix
Local Judge0	Cgroup/sandbox fail → Internal Error 13	Infra: Linux / cgroup / hosted API — app code se nahi
Hosted polling	> 3 ne Accepted (3) ko kabhi “done” nahi maana	> 2 + region header + error throw
DB save	Schema typo intialcode	initialcode + invisibletestCases spelling
Bottom line: Pehle Judge0 server/cgroup samjha, phir polling logic ka bug fix hua, phir Mongoose field names API ke saath align kiye — teen alag layers, teen alag solutions.