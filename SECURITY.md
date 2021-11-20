![](.github/assets/images/cover.png)

# Security concept 🕵️‍♂️

While developing Hashtune's marketplace server, we made security a top-level priority.

<details open>
<summary><b>Table of contents</b></summary>

- [Security concept](#security-concept-)
  - [Goals](#goals)
  - [Approach](#approach)
  - [Personas](#personas)
    - [John](#john)
    - [Amy](#amy)
    - [Sara](#sara)
  - [Threat model](#threat-model)
    - [Disable GraphQL Introspection](#disable-graphql-introspection)
    - [Limiting Graphql queries depth](#limiting-graphql-queries-depth)
    - [Limit GraphQL query complexity](#limit-graphql-query-complexity)
    - [Adding Request Security headers](#adding-request-security-headers)
    - [Logging and Monitoring](#logging-and-monitoring)
    - [SQL injection](#sql-injection)
  - [Footnotes](#footnotes)
  </details>

## Goals

In securing our system, we focused on two high-level goals:

- Availability
- Integrity

## Approach

To improve the security of our system in a structured approach we combine two methods: Threat modelling using the STRIDE framework and Abuser stories

Additionally we checked the [OWASP Top Ten](https://owasp.org/www-project-top-ten/) to avoid common security risks.

We also used the [BURP Suite](https://portswigger.net/burp) to catch low-hanging fruits.

## Personas

### John

John is a non-authenticated user. He can:

- Navigate through artworks;
- See other users' profiles;
- See sale history.

### Amy

Amy is a registered user, but not an approved creator. She can do everything that John can do and:

- Place bids on auctions;
- Buy artworks that are for sale;
- Create an auction or a fixed sale for an artwork she owns.

### Sara

Sara is an approved creator. She can do everything that Sara can do and:

- She can create new artworks.

## Threat model

### Disable GraphQL Introspection

John, Amy, or Sara wants to run a malicious mutation on the server

- Protection
  - [x] Disabling introspection in production.
- Detection
  - [ ] Logged to the log console.
- Response
  - We know who run the request and we would consider a ban

### Limiting Graphql queries depth

John, Amy, or Sara runs a malicious deeply nested query to overload the server

- Protection
  - [x] Limit query depth to 5.
- Detection
  - [ ] The malicious query is logged.
- Response
  - If the user tries to make too many malicious queries we temporarely ban them

### Limit GraphQL query complexity

John, Amy, or Sara can try to overload the the database instance by running malicious resolvers

- Protection
  - [x] With disabled introspection, the user cannot see which resolvers are available by visiting the graphql endpoint;
  - [x] A Query complexity limit is in place, which calculates the query complexity based on the number of values, object, and lists it contains. It then blocks queries with a complexity higher than 2000.
- Detection
  - [ ] The malicious query is logged.
- Response
  - If the user tries to make too many malicious queries we would temporarely ban them

### Adding Request Security headers

We added headers to protect our server from different kinds of attack

- Protection
  - [x] **Access-Control-Allow-Credentials**
        This header tells browsers whether to expose the response to the frontend JavaScript code when the request's credentials mode. [More](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials).
  - [x] **Access-Control-Allow-Origin**
        This header indicates whether the response can be shared with requesting code from the given origin. [More](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin).
  - [x] **Connection**
        This is a general header that controls whether the network connection stays open after the current transaction finishes. If the value sent is `keep-alive`, the connection is persistent and not closed, allowing for subsequent requests to the same server to be done. [More](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection)
  - [x] **Content-Length**
        The **`Content-Length`** header indicates the size of the message body, in bytes, sent to the recipient. [More](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length)
  - [x] **Content-Security-Policy**
        This is an added layer of security that helps to detect and mitigate certain types of attacks, including Cross-Site Scripting ([XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting)) and data injection attacks. [More](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
  - [x] **Content-Type**
        This header is used to indicate the original [media type](https://developer.mozilla.org/en-US/docs/Glossary/MIME_type) of the resource (prior to any content encoding applied for sending). [More](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)
  - [x] **Date**
        Date and time of when the message was generated
  - [x] **ETag**
        Etag is an identifier for a specific version of a resource. It lets caches be more efficient and save bandwidth, as a web server does not need to resend a full response if the content was not changed. Additionally, etags help to prevent simultaneous updates of a resource from overwriting each other (["mid-air collisions"](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag#avoiding_mid-air_collisions)). [More](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
  - [x] **Expect-CT**
        This header lets sites opt in to reporting and/or enforcement of [Certificate Transparency](https://developer.mozilla.org/en-US/docs/Web/Security/Certificate_Transparency) requirements, to prevent the use of misissued certificates for that site from going unnoticed. [More](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect-CT)
  - [x] **Keep-Alive**
        This general header allows the sender to hint about how the connection may be used to set a timeout and a maximum amount of requests. [More](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Keep-Alive)
  - [x] **Referrer-Policy**
        This header controls how much [referrer information](https://developer.mozilla.org/en-US/docs/Web/Security/Referer_header:_privacy_and_security_concerns) (sent with the `[Referer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer)` header) should be included with requests. Aside from the HTTP header, you can [set this policy in HTML](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy#integration_with_html). [More](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy)
  - [x] **Strict-Transport-Security**
        This header lets a web site tell browsers that it should only be accessed using HTTPS, instead of using HTTP. [More](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)
  - [x] **Vary**
        The **`Vary`** HyperText Transfer Protocol (HTTP) response header determines how to match future request headers. This information is required to decide whether or not a cached response can be served instead of requesting a fresh one from the origin server. This response header is used by the server to indicate the headers it used when selecting a representation of a resource in a [content negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation) algorithm. [More](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary)
  - [x] **X-Content-Type-Options**
        This header is a marker used by the server to indicate that the [MIME types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) advertised in the `[Content-Type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type)` headers should be followed and not be changed. The header allows you to avoid [MIME type sniffing](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#mime_sniffing) by saying that the MIME types are deliberately configured. [More](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options)
  - [x] **X-DNS-Prefetch-Control**
        This header controls DNS prefetching, a feature by which browsers proactively perform domain name resolution on both links that the user may choose to follow as well as URLs for items referenced by the document, including images, CSS, JavaScript, and so forth. [More](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control)
  - [x] **X-Download-Options**
        This header is specific to IE 8, and is related to how IE 8 handles downloaded HTML files. Turns out if you download an HTML file from a web page and chooses to "Open" it in IE, it will execute in the context of the web site. [More](https://www.nwebsec.com/HttpHeaders/SecurityHeaders/XDownloadOptions#:~:text=The%20X%2DDownload%2DOptions%20is,context%20of%20the%20web%20site.)
  - [x] **X-Frame-Options**
        This header can be used to indicate whether or not a browser should be allowed to render a page in a `[<frame>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/frame)`, `[<iframe>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)`, `[<embed>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed)` or `[<object>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object)`. Sites can use this to avoid [click-jacking](https://developer.mozilla.org/en-US/docs/Web/Security/Types_of_attacks#click-jacking) attacks, by ensuring that their content is not embedded into other sites. [More](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)
  - [x] **X-Permitted-Cross-Domain-Policies**
        This header is used to permit cross-domain requests from Flash and PDF documents. In most cases, these permissions are defined in an XML document called **`crossdomain.xml`** found in the root directory of the web page. [More](https://www.scip.ch/en/?labs.20180308#:~:text=The%20X%2DPermitted%2DCross%2D,documents%20for%20cross%2Ddomain%20requests.&text=The%20Public%2DKey%2DPins%20header,complexity%20and%20dwindling%20browser%20support.)
  - [x] **X-XSS-Protection**
        This header is a feature of Internet Explorer, Chrome and Safari that stops pages from loading when they detect reflected cross-site scripting ([XSS](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting)) attacks. Although these protections are largely unnecessary in modern browsers when sites implement a strong `[Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy)` that disables the use of inline JavaScript (`'unsafe-inline'`), they can still provide protections for users of older web browsers that don't yet support [CSP](https://developer.mozilla.org/en-US/docs/Glossary/CSP). [More](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection)
- Detection
- Response

### Logging and Monitoring

John, Amy, or Sara do not want to be discovered while attacking the server.

- Protection
  - [ ] Setting up logging and monitoring service on database instance and graphql server
- Detection
  - [ ] Their attak will be registered by the logging and monitoring service
- Response
  - Legal action would be taken

### SQL injection

John, Amy, or Sara wants to compromise the database by running an SQL injection attack.

- Protection
  - [x] Prisma sanitizes the input
- Detection
  - [x] The malicious code will be logged
- Response
  - We would consider banning the user by ip

### Authorization

John wants to sell an artwork that belongs to Amy.

- Protection
  - [x] With introspection disabled, John does not know what is the mutation to call
  - [ ] Without Amy's authentication cookie, the mutation would return an error
- Detection
  - [x] The request will be logged
- Response
  - After detecting the malicious activity we would consider banning the user

## Footnotes

- A Guide to Threat Modelling for Developers ([source](https://martinfowler.com/articles/agile-threat-modelling.html))
- Agile Security Requirements Engineering [source](https://handouts.secappdev.org/handouts/2008/abuser%20stories.pdf)
- What is an Abuser Story (Software) [Source](https://rietta.com/blog/what-is-an-abuser-story-software/)
