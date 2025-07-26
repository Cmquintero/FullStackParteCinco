Cypress.Commands.add("login", ({ username, password }) => {
  cy.request("POST", "http://localhost:3003/api/login", {
    username,
    password,
  }).then(({ body }) => {
    localStorage.setItem("loggedBlogappUser", JSON.stringify(body));
    cy.visit("http://localhost:3003");
  });
});

Cypress.Commands.add("createBlog", ({ title, author, url }) => {
  cy.window().then((win) => {
    const user = JSON.parse(win.localStorage.getItem("loggedBlogappUser"));
    cy.request({
      url: "http://localhost:3003/api/blogs",
      method: "POST",
      body: { title, author, url },
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
  });
  cy.visit("http://localhost:5173");
});
