# unified-contribution-graph
Scrapes contribution data from GitHub, GitLab and Leetcode and compiles them into one unified object.

## Usage
Add your usernames into the fields at the top of `main.js`. Leaving one blank will tell the app to ignore that service.
```
const USR_GITHUB = '';
const USR_GITLAB = '';
const USR_LEETCODE = '';
```

The object is stored at the end of `main()` in `unifiedData`. 

## Tools
- [Axios](https://www.npmjs.com/package/axios)
- [Cheerio](https://www.npmjs.com/package/cheerio)
- [Node-fetch](https://www.npmjs.com/package/node-fetch)