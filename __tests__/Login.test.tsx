/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";
import { config } from "../lib/config";
import Login from "../pages/login";

const server = setupServer(
	rest.post(`${config.apiBase}/login`, (_req, res, ctx) => {
		return res(
			ctx.json({
				status: "SUCCESS",
				data: {
					token: "mocked_user_token",
					user: {},
				},
				message: "Login success",
			})
		);
	})
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("allows the user to log in", async () => {
	render(<Login />);
	userEvent.type(screen.getByTestId("username"), "john.maverick");
	userEvent.type(screen.getByTestId("password"), "super-secret");
	userEvent.click(screen.getByText(/Login/i));
	expect(screen.findByText(/Dashboard/i)).toBeTruthy();
	expect(window.sessionStorage.getItem("token")).toEqual("mocked_user_token");
});
