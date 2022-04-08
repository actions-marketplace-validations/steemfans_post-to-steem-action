const core = require('@actions/core');
const getSlug = require('speakingurl');
const secureRandom = require('secure-random');
const steem = require('steem');

async function main() {
  try {
    const title = core.getInput('title', { required: true });
    const content = core.getInput('content', { required: true });
    const tags = core.getInput('tags', { required: true });
    const author = core.getInput('author', { required: true });
    const wif = core.getInput('posting_key', { required: true });
    const reward = core.getInput('reward', { required: true });
    const parentAuthor = '';
    const allowVotes = true;
    const allowCurationRewards = true;
    const extensions = [];
    let maxAcceptedPayout = '1000000.000 SBD';
    let percentSteemDollars = 10000;

    const tagsArr = tags.split(',');

    if (tagsArr.length === 0) {
      throw {
        message: 'tags must be not empty.'
      }
    }

    console.log(title, content, tagsArr, author, wif);

    const jsonMetadata = {
      tags: tagsArr,
      format: 'markdown',
      app: 'post-to-steem-action/1.0.0',
    };

    const permlink = await createPermlink(title, author, parentAuthor, tagsArr[0]);

    const result = await steem.broadcast.commentAsync(wif, parentAuthor, tagsArr[0], author, permlink, title, content, jsonMetadata);

    console.log('result: ', result);

    switch (reward) {
      case 100:
        percentSteemDollars = 0;
        break;
      case 50:
        percentSteemDollars = 10000;
        break;
      case 0:
        maxAcceptedPayout = '0.000 SBD';
        break;
    }

    const result2 = await steem.broadcast.commentOptionsAsync(wif, author, permlink, maxAcceptedPayout, percentSteemDollars, allowVotes, allowCurationRewards, extensions);
    console.log('result2: ', result2);

  } catch (error) {
    core.setFailed(error.message);
  }
}

async function createPermlink(title, author, parentAuthor, parentPermlink) {
  let permlink;
  if (title && title.trim() !== '') {
    let s = slug(title);
    if (s === '') {
      s = base58.encode(secureRandom.randomBuffer(4));
    }
    // ensure the permlink(slug) is unique
    const slugState = await steem.api.getContentAsync(author, s);
    let prefix;
    if (slugState.body !== '') {
      // make sure slug is unique
      prefix = `${base58.encode(secureRandom.randomBuffer(4))}-`;
    } else {
      prefix = '';
    }
    permlink = prefix + s;
  } else {
    // comments: re-parentauthor-parentpermlink-time
    const timeStr = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '');
    const tmpParentPermlink = parentPermlink.replace(/(-\d{8}t\d{9}z)/g, '');
    permlink = `re-${parentAuthor}-${tmpParentPermlink}-${timeStr}`;
  }
  if (permlink.length > 255) {
    // STEEMIT_MAX_PERMLINK_LENGTH
    permlink = permlink.substring(permlink.length - 255, permlink.length);
  }
  // only letters numbers and dashes shall survive
  permlink = permlink.toLowerCase().replace(/[^a-z0-9-]+/g, '');
  return permlink;
}

function slug(text) {
  return getSlug(text.replace(/[<>]/g, ''), { truncate: 128 });
}

// Call the main function to run the action
main();
