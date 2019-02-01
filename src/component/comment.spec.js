import React from 'react'
import { shallow } from 'enzyme'

import Comment from './comment'
import Avatar from './avatar'

import cheerio from 'cheerio'

const comment = {
  html_url: 'https://github.com/xxxx/xxxxx/issues/1#issuecomment-xxxxx',
  body_html: '<p>123</p>',
  created_at: '2017-06-30T09:01:19Z',
  user: {
    login: 'booxood',
    avatar_url: 'https://avatars0.githubusercontent.com/u/2151410?v=3',
    html_url: 'https://github.com/booxood'
  }
}

const emailComment = {
  html_url: 'https://github.com/xxxx/xxxxx/issues/1#issuecomment-xxxxx',
  body_html: `
<div class="email-fragment">Email response test</div>
<span class="email-hidden-toggle"><a href="#">…</a></span><div class="email-hidden-reply">
<div class="email-quoted-reply">On Thu, 2019-01-31 at 11:20 -0800, wiredmane wrote:
 blog test


 —
 You are receiving this because you authored the thread.
 Reply to this email directly, view it on GitHub, or mute the thread.

 {"api_version":"1.0","publisher":{"api_key":"05dde50f1d1a384dd78767c5
 5493e4bb","name":"GitHub"},"entity":{"external_key":"github/garrettbr
 yan/garrettbryan.github.io","title":"garrettbryan/garrettbryan.github
 .io","subtitle":"GitHub repository","main_image_url":"
 <a href="https://github.githubassets.com/images/email/message_cards/header.png%22,%22avatar_image_url%22:%22https://github.githubassets.com/images/email/message_cards/avatar.png%22,%22action%22:%7B%22name%22:%22Open">https://github.githubassets.com/images/email/message_cards/header.png","avatar_image_url":"https://github.githubassets.com/images/email/message_cards/avatar.png","action":{"name":"Open</a>
  in GitHub","url":"
 ***@***.***
  in <a class="issue-link js-issue-link" data-error-text="Failed to load issue title" data-id="405060178" data-permission-text="Issue title is private" data-url="https://github.com/garrettbryan/garrettbryan.github.io/issues/10" href="https://github.com/garrettbryan/garrettbryan.github.io/issues/10">#10</a>: blog test"}],"action":{"name":"View Issue","url":"
 <a class="issue-link js-issue-link" data-error-text="Failed to load issue title" data-id="405060178" data-permission-text="Issue title is private" data-url="https://github.com/garrettbryan/garrettbryan.github.io/issues/10" href="https://github.com/garrettbryan/garrettbryan.github.io/issues/10#issuecomment-459471211">#10 (comment)</a>
 "}}}
 [
 {
 ***@***.***": "<a href="http://schema.org">http://schema.org</a>",
 ***@***.***": "EmailMessage",
 "potentialAction": {
 ***@***.***": "ViewAction",
 "target": "
 <a class="issue-link js-issue-link" data-error-text="Failed to load issue title" data-id="405060178" data-permission-text="Issue title is private" data-url="https://github.com/garrettbryan/garrettbryan.github.io/issues/10" href="https://github.com/garrettbryan/garrettbryan.github.io/issues/10#issuecomment-459471211">#10 (comment)</a>
 ",
 "url": "
 <a class="issue-link js-issue-link" data-error-text="Failed to load issue title" data-id="405060178" data-permission-text="Issue title is private" data-url="https://github.com/garrettbryan/garrettbryan.github.io/issues/10" href="https://github.com/garrettbryan/garrettbryan.github.io/issues/10#issuecomment-459471211">#10 (comment)</a>
 ",
 "name": "View Issue"
 },
 "description": "View this Issue on GitHub",
 "publisher": {
 ***@***.***": "Organization",
 "name": "GitHub",
 "url": "<a href="https://github.com">https://github.com</a>"
 }
 }
 ]</div>
<div class="email-fragment"></div>
</div>
  `,
  created_at: '2017-06-30T09:01:19Z',
  user: {
    login: 'booxood',
    avatar_url: 'https://avatars0.githubusercontent.com/u/2151410?v=3',
    html_url: 'https://github.com/booxood'
  }
}

describe('Comment', function () {
  it('render extended emailed comment', function () {
    const props = {
      comment: emailComment
    }
    const wrapper = shallow(<Comment {...props} />)
    expect(wrapper.find('.gt-comment-body').render().html()).toEqual(expect.stringContaining(cheerio.load(emailComment.body_html).html()))
  })

  it('render with no user', function () {
    const props = {
      comment
    }
    const wrapper = shallow(<Comment {...props} />)
    expect(wrapper.hasClass('gt-comment')).toBe(true)
    expect(wrapper.find(Avatar)).toHaveLength(1)
    expect(wrapper.find('.gt-comment-header')).toHaveLength(1)
    expect(wrapper.find('.gt-comment-username').prop('href')).toEqual(comment.user.html_url)
    expect(wrapper.find('.gt-comment-username').text()).toEqual(comment.user.login)
    expect(wrapper.find('.gt-comment-date').text()).toEqual(expect.stringMatching(/ago$/))
    expect(wrapper.find('.gt-comment-body').render().html()).toEqual(expect.stringContaining(comment.body_html))
    expect(wrapper.find('.gt-comment-like')).toHaveLength(0)
  })

  it('render with user but isn\'t creator', function () {
    const props = {
      comment,
      user: { login: 'hello' }
    }
    const wrapper = shallow(<Comment {...props} />)
    expect(wrapper.find('.gt-comment-edit')).toHaveLength(0)
  })

  it('render with user is creator', function () {
    const props = {
      comment,
      user: { login: 'booxood' }
    }
    const wrapper = shallow(<Comment {...props} />)
    expect(wrapper.find('.gt-comment-edit')).toHaveLength(1)
  })

  it('render with creator isn\'t admin', function () {
    const props = {
      comment,
      admin: ['hello']
    }
    const wrapper = shallow(<Comment {...props} />)
    expect(wrapper.hasClass('gt-comment-admin')).toBe(false)
  })

  it('render with creator is admin', function () {
    const props = {
      comment,
      admin: ['booxood', 'hello']
    }
    const wrapper = shallow(<Comment {...props} />)
    expect(wrapper.hasClass('gt-comment-admin')).toBe(true)
  })

  it('set props commentedText', function () {
    const commentedText = 'commentedText'
    const props = {
      comment,
      commentedText
    }
    const wrapper = shallow(<Comment {...props} />)
    expect(wrapper.find('.gt-comment-text').text()).toEqual(commentedText)
  })

  it('set props language=zh-TW', function () {
    const props = {
      comment,
      language: 'zh-TW'
    }
    const wrapper = shallow(<Comment {...props} />)
    expect(wrapper.find('.gt-comment-date').text()).toEqual(expect.stringContaining('前'))
  })

  it('set props comment reactions 10', function () {
    const props = {
      comment: Object.assign({}, comment, {
        reactions: {
          totalCount: 10,
          viewerHasReacted: true,
          pageInfo: {
            hasNextPage: false
          },
          nodes: []
        }
      })
    }

    const wrapper = shallow(<Comment {...props} />)
    expect(wrapper.render().find('.gt-ico-heart .gt-ico-text').text()).toEqual('10')
  })

  it('set props comment reactions 100+', function () {
    const props = {
      comment: Object.assign({}, comment, {
        reactions: {
          totalCount: 100,
          viewerHasReacted: false,
          pageInfo: {
            hasNextPage: true
          },
          nodes: []
        }
      })
    }

    const wrapper = shallow(<Comment {...props} />)
    expect(wrapper.render().find('.gt-ico-heart .gt-ico-text').text()).toEqual('100+')
  })
})
