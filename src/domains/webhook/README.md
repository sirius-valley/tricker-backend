# Webhooks

This document explains how Tricker's Webhooks Service was built and how it works.

A **webhook** is registered in the issue provider's platform every time a project is integrated.
Webhook's information is saved a `WebhookSource` entity in the database with a UUID, so every registered webhook is
unique in our database. We also create a relationship with an `Issue Provider` and with the integrated `Project`.

When a webhook request is received, the necessary validations to the request are performed, and
then the webhook's payload is processed and results are saved in the database.

An in-memory queue process webhooks in the order they arrive, so no inconsistencies may be produced. We also save a
log of every webhook in the database, as well as the status of the processing (either 'ERROR' or 'PROCESSED').

## Controller

The controller only has one unique endpoint. This endpoint listens to all webhook requests from all the
different **issue providers**.

Only requests from registered webhooks are validated, as this endpoint needs the `WebhookSource` ID to perform the right
validations.

Each request is validated via `validateWebhook` middleware, that performs a series of
checks depending on the issue provider.

As an example, for Linear, as the [provider's documentation](https://developers.linear.app/docs/graphql/webhooks) suggests,
we check the request's origin IP to be correct and also the Linear's signature to match the webhook's secret.

`validateWebhook` middleware uses `registerWebhookMiddleware` function,
which is in change of registering and associating a `WebhookMiddleware` implementation to an issueProvider's name,
so each supported provider should have **one** `WebhookMiddleware` implementation.


## Service

The method is charge of processing the webhook is `handleWebhookArrival`.

### Steps:

- #### Webhook Identification:

The function extracts a unique identifier for the webhook from the request parameters.
With this ID, it retrieves information about the `WebhookSource` and its associated `Issue Provider`.

- #### Queue:

The actual processing of the webhook payload is queued for asynchronous execution.
This approach allows for scalability and allows handling high volumes of webhook requests efficiently.

- #### Payload Processing:

Within the queued task, the function uses a `WebhookProcessor` implementation to transform and perform actions
on the data contained within the webhook payload.
The processor uses the issue provider's name to tailor its actions.

There are several interfaces involved in the process:
- A `WebhookProcessor` with implementations
- A `WebhookConverter` with implementations
- And a `WebhookAction` with implementations

Briefly, the `WebhookProcessor` (as for now there's only one implementation) identifies the entity to be transformed into
a `TrickerEntity` and an action to be performed once the data adaptation is complete.
Then, in a similar way as the `validateWebhook` middleware, a `WebhookConverterStrategyProvider`
and a `WebhookActionStrategyProvider` select the implementation depending on the `Issue Provider`, the type of webhook
action and the entity to transform.

- #### Logging and Status Update:

Upon successful processing, the function persists a log entry in the database.
This log includes the received payload, the source identifier, and status whether processing was successful or not.

- #### Error Management:

The queued processing incorporates error handling mechanisms.
In case of any exceptions, the function logs the error details and throws a custom exception containing
information about the webhook source and the encountered issue.


## To Do
- [ ] Implement multiple `WebhookActionStrategy` for:
  - Issue creation
  - Issue update
  - Issue deletion
  - Label creation
  - Label update
  - Label deletion
- [ ] Complete Linear's `WebhookConverter` implemention to transform Issues and Labels.
- [ ] Add implementations to the providers