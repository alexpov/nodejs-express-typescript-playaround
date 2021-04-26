# Similar words service

## General notes
- Its a learning project, just to play arround with with Nodejs & TypeScript
- I used https://github.com/ljlm0402/typescript-express-starter as starter code
- Using NodeJs v14 + express + TypeScript
- Can run the service locally using nodejs + npm or Docker container
- Using Swagger for API documentation

## Implementation details

### Algorithm
When service starts, doing dictionary pre-processing. This improves significantly similar word lookup performance since it will do lookup operations in memory.
I provided (and tested) 2 different pre-processing data structures. First is based on Trie, Second is based on Javascript standard Map.

Insert word to dictionary operation:
- sort word alphabetically
- insert to the container (Map or Trie)
- store as value the original word
- values stored as an arrays of distict words as requred in `http://localhost:8000/api/v1/similar` REST API

Lookup similar words operation:
- sort word alphabetically
- lookup sorted word in the dictionary (Map or Trie)
- before returning the similar words array, remove the input word from the array (no-op if its not in the array)

Sorting word alphabetically since all similar words will have same form when sorted alphabetically, hance sorted word is used as key in the pre-processing data structures.

Following performance and memory metrics I measured, by default using the Map based implementation.


### Testing:

#### Unittest
Add few tests in `src/tests`. Can use `npm run tests` for running them.

#### Memory
I added memory usage log when service starts. Looks like this:
```
info: Process memory usage: {"rss":"153.93 MB -> Resident Set Size - total memory allocated for the process execution","heapTotal":"118.66 MB -> total size of the allocated heap","heapUsed":"98.41 MB -> actual memory used during the execution","external":"1.35 MB -> V8 external memory","timestamp":"2021-01-24 09:01:25"}
```

I tested both Map and Trie for the provided dictionary. Map option provided better results. Potential explanation is in `src/services/similar-words.service.ts`

Results I had (Windows)
```
Map:

info: Process memory usage: 
{
  "rss":"142.03 MB -> Resident Set Size - total memory allocated for the process execution",
  "heapTotal":"117.13 MB -> total size of the allocated heap",
  "heapUsed":"87.48 MB -> actual memory used during the execution",
  "external":"1.53 MB -> V8 external memory","timestamp":"2021-01-24 10:22:32"
}


Trie:

info: Process memory usage: 
{
  "rss":"594.29 MB -> Resident Set Size - total memory allocated for the process execution",
  "heapTotal":"556.11 MB -> total size of the allocated heap",
  "heapUsed":"534.76 MB -> actual memory used during the execution",
  "external":"1.53 MB -> V8 external memory","timestamp":"2021-01-24 10:23:18"
}
```

#### Lookup performance

I used `src/pref-test.js` to run lookup tests. Using `avgProcessingTimeNs` stats for comparison.

*NOTE:* The script is windows based, it won't work on linux

The script runs 400 request using node-fetch. The request are executed using promises asynchronously. While testing, I executed the script several times.

In general, Map preformed a bit faster. However, after execution of multiple requests, the results were close.

Results I had (Windows)

```
Lookup: Running the perf-script 5 times, each time it executes 400 async requests
Map
{
  totalWords: 351075,
  totalRequests: 2000,
  avgProcessingTimeNs: 234347.70000000004
}


Trie
{
  totalWords: 351075,
  totalRequests: 2000,
  avgProcessingTimeNs: 263565.45000000007
}


Lookup: Running the perf-script once, total 400 async requests
Map:
{
  totalWords: 351075,
  totalRequests: 400,
  avgProcessingTimeNs: 229527.74999999997
}

Trie:
{
  totalWords: 351075,
  totalRequests: 400,
  avgProcessingTimeNs: 322042.74999999994
}
```

*NOTE:* Just to state the obvious, it a POC perf test, mainly to check service stability. It does not represent real lookup patterns nor real workloads. Need to more extensive tests to conclude something of value in regards to performance behavior of this service. 

## How to run using Docker

```bash
# build
tag=prisma-prod make build

# run
tag=prisma-prod name=prisma-hw port=8000 make run
```

Verify service is running

```bash
# check the container is running
docker ps | grep prisma-hw

# check service logs
docker logs prisma-hw
```

Expected logs:
```
info: Initializing words dictionary, using file words_dictionary.txt {"timestamp":"2021-01-24 09:01:24"}
info: Initializing dictionary done {"timestamp":"2021-01-24 09:01:25"}
info: Initializing dictionary done, total number of added distinct words 351075 {"timestamp":"2021-01-24 09:01:25"}
info: Process memory usage: {"rss":"153.93 MB -> Resident Set Size - total memory allocated for the process execution","heapTotal":"118.66 MB -> total size of the allocated heap","heapUsed":"98.41 MB -> actual memory used during the execution","external":"1.35 MB -> V8 external memory","timestamp":"2021-01-24 09:01:25"}
info: 🚀 App listening on the port 8000 {"timestamp":"2021-01-24 09:01:25"}
```


## How to run using node, tested with NodeJs v14

```bash
# build node package
npm install

# start service in prod mode
npm run start
```

## How to check API documentation (Swagger)

Once the service is running, the API will be available in `http://localhost:8000/api-docs`

## Dictionary location

Using defalut dictionary provided in the initial email. To replace dictionary do:
- place new dictionary txt file in the `/src` dir
- set dictionary file name variable `DICTIONARY_FILE_NAME=${filename}.txt` in `.env` file
