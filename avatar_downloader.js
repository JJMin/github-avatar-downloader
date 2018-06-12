var request = require('request');
var token = require('./secrets');
var fs = require('fs');
var owner = process.argv[2];
var repo = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': token.GITHUB_TOKEN
    }
  };

  request(options, function (err, res, body) {
    cb(err, JSON.parse(body));
  });
}

getRepoContributors(owner, repo, function (err, result) {
  console.log("Errors:", err);

  result.forEach(user => {
    downloadImageByURL(user.avatar_url, 'avatars/' + user.id + '.png');
  });
});

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function (err) {
      throw err;
    })
    .on('response', function (response) {
      console.log('Response Status Code: ', response.statusCode);
    })
    .pipe(fs.createWriteStream(filePath));
}