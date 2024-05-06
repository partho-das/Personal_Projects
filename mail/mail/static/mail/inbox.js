document.addEventListener("DOMContentLoaded", function () {
  // Use buttons to toggle between views
  document
    .querySelector("#inbox")
    .addEventListener("click", () => load_mailbox("inbox"));
  document
    .querySelector("#sent")
    .addEventListener("click", () => load_mailbox("sent"));
  document
    .querySelector("#archived")
    .addEventListener("click", () => load_mailbox("archive"));
  document.querySelector("#compose").addEventListener("click", compose_email);

  document
    .querySelector("#compose-form")
    .addEventListener("submit", (event) => {
      submit_email(event);
    });

  // By default, load the inbox
  load_mailbox("inbox");
});

function submit_email(event) {
  event.preventDefault();

  console.log("Submitted");
  let replay_dash = "-".repeat(20) + "Previous Messages" + "-".repeat(20);
  body = document.querySelector("#compose-body").value;
  body = body.replace(replay_dash, "");

  fetch(`/emails`, {
    method: "POST",
    body: JSON.stringify({
      recipients: document.querySelector("#compose-recipients").value,
      subject: document.querySelector("#compose-subject").value,
      body: body,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (!result.error) load_mailbox("sent");
      else {
        alert(result.error);
      }
    });
}

function compose_email(event, recipients = "", subject = "", body = "") {
  document.querySelector("#message-view").innerHTML = "";
  // Show compose view and hide other views
  document.querySelector("#emails-view").style.display = "none";
  document.querySelector("#email-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "block";

  // Clear out composition fields
  document.querySelector("#compose-recipients").value = recipients;
  document.querySelector("#compose-subject").value = subject;
  document.querySelector("#compose-body").value = body;
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector("#emails-view").style.display = "block";
  document.querySelector("#email-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "none";
  document.querySelector("#message-view").innerHTML = "";

  // Show the mailbox name
  let email_view = document.querySelector("#emails-view");
  email_view.innerHTML = `<h3>${
    mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
  }</h3>`;
  fill_mailbox(email_view, mailbox);
}

function fill_mailbox(email_view, mailbox) {
  fetch(`/emails/${mailbox}`)
    .then((response) => response.json())
    .then((emails) => {
      emails.forEach((email) => {
        let newmail = document.createElement("div");
        newmail.classList.add("mail-list");

        let [subject, body, timestamp, archive] = [
          "div",
          "div",
          "div",
          "div",
        ].map((tag) => document.createElement(tag));

        subject.classList.add("mail-list-subject");
        subject.innerHTML =
          email.subject.length > 25
            ? `${email.subject.substring(0, 25)}...`
            : email.subject;

        body.classList.add("mail-list-body");
        body.innerHTML =
          email.body.length > 100
            ? `${email.body.substring(0, 100)}...`
            : email.body;
        timestamp.classList.add("mail-list-timestamp");
        timestamp.innerHTML = email.timestamp;

        archive.classList.add("btn", "btn-primary", "mail-list-archive");

        if (mailbox === "inbox") archive.innerHTML = "Archive";
        else if (mailbox === "archive") archive.innerHTML = "Unarchive";
        else archive.style.display = "none";

        newmail.append(subject, body, timestamp, archive);
        if (email.read) newmail.style.backgroundColor = "lightgray";
        email_view.append(newmail);

        newmail.addEventListener("click", () => {
          open_email(email.id);
        });

        archive.addEventListener("click", (event) => {
          fetch(`/emails/${email.id}`, {
            method: "PUT",
            body: JSON.stringify({
              archived: event.target.innerHTML == "Archive" ? true : false,
            }),
          });
          // console.log(event.target.parentNode.style.animationPlayState);
          event.target.parentNode.style.animationPlayState = "running";
          event.target.parentNode.addEventListener("animationend", () => {
            event.target.parentNode.style.display = "none";
          });

          event.stopPropagation();
        });
      });
      if (emails.length === 0) {
        // console.log("HI");
        let message = document.createElement("div");
        message.innerHTML = "Empty List!";
        document.querySelector("#message-view").append(message);
      }
    });
}

function open_email(id) {
  document.querySelector("#emails-view").style.display = "none";
  let email_view = document.querySelector("#email-view");
  document.querySelector("#compose-view").style.display = "none";
  email_view.style.display = "block";
  fetch(`/emails/${id}`)
    .then((response) => response.json())
    .then((email) => {
      display_email(email_view, email);
      fetch(`/emails/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          read: true,
        }),
      });

      document
        .querySelector(".email-view-replay")
        .addEventListener("click", (event) => {
          email_replay(email);
        });
    });
}

function display_email(email_view, email) {
  email_view.innerHTML = "";
  let [
    title,
    recipients,
    subject,
    bodyHeading,
    body,
    replay,
    sender,
    timestamp,
  ] = ["div", "div", "div", "div", "pre", "div", "div", "div"].map((tag) => {
    return document.createElement(tag);
  });

  title.classList.add("email-view-title");
  sender.classList.add("email-view-sender");
  timestamp.classList.add("email-view-timestamp");
  recipients.classList.add("email-view-recipients");
  subject.classList.add("email-view-subject");
  body.classList.add("email-view-body");
  replay.classList.add("email-view-replay");
  bodyHeading.classList.add("email-view-bodyheading");

  sender.innerHTML = `Sender: ${email.sender}`;
  timestamp.innerHTML = email.timestamp;
  title.append(sender, timestamp);

  recipients.innerHTML = `Recipients: ${email.recipients}`;
  subject.innerHTML = `Subject: ${email.subject}`;

  bodyHeading.innerHTML = "Email Body:";
  body.innerHTML = `${email.body}`;
  replay.classList.add("btn", "btn-primary");
  replay.innerHTML = "Replay";
  email_view.append(title, recipients, subject, bodyHeading, body, replay);
}

function email_replay(email) {
  let subject = email.subject;
  if (subject.substring(0, 3) != "Re:") {
    subject = "Re: " + subject;
  }
  let replay_dash =
    "\n".repeat(5) +
    "-".repeat(20) +
    "Previous Messages" +
    "-".repeat(20) +
    "\n".repeat(1);
  let body = `${replay_dash}On ${email.timestamp} ${email.sender} Wrote:\n${email.body}`;

  console.log(email.subject);
  //   return;
  compose_email("", email.sender, subject, body);
}
