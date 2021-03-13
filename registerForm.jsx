import React from "react";
import Joi from "joi-browser";
import Form from "../common/form";
import Input from "../common/input";
import { register } from "../services/userService";
import auth from "../services/authService";

class RegisterForm extends Form {
  state = {
    data: { username: "", name: "", password: "" },
    errors: {},
  };

  schema = {
    username: Joi.string().email().required().label("Username"),
    name: Joi.string().required().label("Name"),
    password: Joi.string().min(5).required().label("Password"),
  };

  doSubmit = async () => {
    try {
      const response = await register(this.state.data);
      auth.loginWithJwt(response.headers["x-auth-token"]);
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    const { data, errors } = this.state;

    return (
      <div className="overlay">
        <form onSubmit={this.handleSubmit}>
          <div className="con">
            <header className="head-form">
              <h2>Sign Up</h2>
              <p>Register here using your username, name and password</p>
            </header>
            <br />
            <div className="field-set">
              <Input
                label="Username"
                name="username"
                value={data.username}
                onChange={this.handleChange}
                error={errors.username}
              />
              <br />
              <Input
                label="Name"
                name="name"
                value={data.name}
                onChange={this.handleChange}
                error={errors.name}
              />
              <br />
              <Input
                label="Password"
                name="password"
                value={data.password}
                onChange={this.handleChange}
                error={errors.password}
              />
              <br />
              <button disabled={this.validate()} className="log-in">
                {" "}
                Sign Up{" "}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default RegisterForm;
