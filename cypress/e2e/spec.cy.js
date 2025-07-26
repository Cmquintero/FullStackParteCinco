describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "Carlos Mario Trigos",
      username: "mariodev",
      password: "password",
    };
    cy.request("POST", "http://localhost:3003/api/users/", user);
    cy.visit("http://localhost:5173");
  });

  it("Login form is shown", function () {
    cy.contains("Blogs");
    cy.contains("Log in to application");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("mariodev");
      cy.get("#password").type("password");
      cy.get("#login-btn").click();
      cy.contains("Carlos Mario Trigos logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("mariodev");
      cy.get("#password").type("wrong");
      cy.get("#login-btn").click();
      cy.get(".error")
        .should("contain", "invalid username or password")
        .and("have.css", "color", "rgb(255, 0, 0)")
        .and("have.css", "border-style", "solid");

      cy.get("html").should("not.contain", "Carlos Mario Trigos logged in");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "mariodev", password: "password" });
    });

    it("a blog can be created", function () {
      cy.createBlog({
        title: "A blog created by cypress",
        author: "Cypress",
        url: "https://pajasblogsexample.com",
      });

      cy.contains("A blog created by cypress");
    });

    describe("and several blogs exist", function () {
      it("only the creator can see the delete button", function () {
        cy.createBlog({
          title: "private blog",
          author: "Author OneHundred",
          url: "https://private.com",
        });

        cy.contains("Logout").click();

        const newUser = {
          name: "New User",
          username: "newuser",
          password: "anotherpassword",
        };
        cy.request("POST", "http://localhost:3003/api/users/", newUser);

        cy.login({ username: "newuser", password: "anotherpassword" });

        cy.contains("private blog").parent().find("button").click();
        cy.contains("private blog").parent().should("not.contain", "delete");
      });

      beforeEach(function () {
        cy.createBlog({
          title: "first blog",
          author: "author cero",
          url: "https://pajasblogsexample1.com",
        });
        cy.createBlog({
          title: "second blog",
          author: "author One",
          url: "https://pajasblogsexample2.com",
        });
        cy.createBlog({
          title: "third blog",
          author: "author two",
          url: "https://pajasblogsexample3.com",
        });
      });

      it("one of those can be liked", function () {
        cy.contains("third blog").parent().find("button").click();
        cy.get("#like-btn").click();
      });

      it("one of those can be deleted", function () {
        cy.contains("second blog").parent().find("button").click();
        cy.get("#delete-btn").click();
        cy.get("html").should("not.contain", "second blog");
      });

      it("they are ordered by the number of likes in descending order", async function () {
        cy.contains("third blog").parent().find("button").click();
        cy.get("#like-btn").click().wait(500).click().wait(500);
        cy.contains("third blog").parent().find("button").click();

        cy.contains("second blog").parent().find("button").click();
        cy.get("#like-btn")
          .click()
          .wait(500)
          .click()
          .wait(500)
          .click()
          .wait(500);

        cy.get(".blog").eq(0).should("contain", "second blog");
        cy.get(".blog").eq(1).should("contain", "third blog");
        cy.get(".blog").eq(2).should("contain", "first blog");
      });
    });
  });
});
