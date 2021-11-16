# Security concept 🔒

While developing Hashtune's marketplace server, we made security a top-level priority.


<details>
<summary><b>Table of contents</b></summary>

- [Security concept 🔒](#security-concept-)
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
    - [Security issues in dependencies](#security-issues-in-dependencies)
    - [SQL injection](#sql-injection)
    - [Too verbose error messages](#too-verbose-error-messages)
  - [Footnotes](#footnotes)
</details>

## Goals
In securing our system, we focused on two high-level goals:
* Availability
* Integrity

## Approach
To improve the security of our system in a structured approach we combine two methods: _Threat modelling_[¹](#footnotes) using the STRIDE framework and _Abuser stories_[²](#footnotes).

Additionally we checked the [OWASP Top Ten](https://owasp.org/www-project-top-ten/) to avoid common security risks.

We also used the [BURP Suite](https://portswigger.net/burp) to catch low-hanging fruits.

## Personas

### John
John is a non-authenticated user. He can:
* Navigate through artworks;
* See other users' profiles;
* See sale history.

### Amy
Amy is a registered user, but not an approved creator. She can do everything that John can do and:
* Place bids on auctions;
* Buy artworks that are for sale;
* Create an auction or a fixed sale for an artwork she owns.

### Sara
Sara is an approved creator. She can do everything that Sara can do and:
* She can create new artworks.

## Threat model

### Disable GraphQL Introspection
John, Amy, or Sara wants to run a malicious mutation on the server
* Protection
	- [x] Disabling introspection in production.
* Detection
	- [ ] Logged to the log console.
* Response
    - We know who run the request
    - TODO: We ban the ip

### Limiting Graphql queries depth
John, Amy, or Sara runs a malicious deeply nested query to overload the server
* Protection
    - [x] Limit query depth to 5.
* Detection
	- [ ] The malicious query is logged.
* Response
    - TODO: If the user tries to make too many malicious queries we temporarely ban them

### Limit GraphQL query complexity
John, Amy, or Sara can try to overload the the database instance by running malicious resolvers
* Protection
    - [x] With disabled introspection, the user cannot see which resolvers are available by visiting the graphql endpoint;
	- [x] A Query complexity limit is in place, which calculates the query complexity based on the number of values, object, and lists it contains. It then blocks queries with a complexity higher than 2000.
* Detection
	- [ ] The malicious query is logged.
* Response
	- TODO: If the user tries to make too many malicious queries we temporarely ban them

### Adding Request Security headers

* Protection
    - [ ]
* Detection
    - [ ]
* Response
    - 
### Logging and Monitoring

* Protection
    - [ ]
* Detection
    - [ ]
* Response
    - 

### Security issues in dependencies

* Protection
    - [ ]
* Detection
    - [ ]
* Response
    - 

### SQL injection

* Protection
    - [ ]
* Detection
    - [ ]
* Response
    - 

### Too verbose error messages

* Protection
    - [ ]
* Detection
    - [ ]
* Response
    - 

## Footnotes
1. "[R]isk-based approach to designing secure systems [...], based on identifying threats in order to develop mitigations to them." _([source](https://martinfowler.com/articles/agile-threat-modelling.html))_
1. "[A] user story from the point of view of a malicious adversary" _([source](https://rietta.com/blog/what-is-an-abuser-story-software/))_, used to "identify how attackers may abuse the system and jeopardize stakeholders' assets." _([source](https://handouts.secappdev.org/handouts/2008/abuser%20stories.pdf))_
