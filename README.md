# Post To Steem Action
This action allows you to post an article to [Steem chain](https://steemit.com).

## Inputs

### `title`
**Required** The title of the article.

### `content`
**Required** The content of the article.

### `tags`
**Required** The tags of the article. The tags need join by comma, like `tag1,tag2,tag3`.

### `author`
**Required** The username which you want to use to post.

### `posting_key`
**Required** The posting key of author. **This is a SECRET param**.

### `reward`
**Required** The reward setting of article.
Only support three options: 0, 50, 100.
* 0 means *Decline Payout*.
* 50 means *50% SBD / 50% SP* (Default)
* 100 means *Power Up 100%*

### `dry_run`
If set 1, the action would not submit article to Steem chain.

## Outputs

### `permlink`
The permlink url of article.

## Example usage

First get in repo's settings and add secret `POSTING_KEY` for action.

Then create workflow step like this:

```
uses: steemfans/post-to-steem-action@master
with:
  posting_key: ${{ secrets.POSTING_KEY }}
  title: This is a test post
  author: 'ety001'
  tags: 'test,test1,test2'
  content: |
    # This is a test post from github action
    Hello! [https://github.com/steemfans/post-to-steem-action](https://github.com/steemfans/post-to-steem-action)
```

## Vote Me

If you think this tool is useful, please give me a witness vote.
Thank you!

My witness name: **ety001**.

or use direct link to vote:
[https://auth.steem.fans/sign/account_witness_vote?approve=1&witness=ety001](https://auth.steem.fans/sign/account_witness_vote?approve=1&witness=ety001)
