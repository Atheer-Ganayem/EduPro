export type Res = {
  error: boolean;
  message: string;
  code: number;
};

export function notFound(): Res {
  return { error: true, message: "Resource not found", code: 404 };
}

export function notAuthenticated(): Res {
  return { error: true, message: "Not authenticated", code: 403 };
}

export function notAuthorized(): Res {
  return { error: true, message: "Not authorized", code: 401 };
}

export function invalidClientInputs(): Res {
  return { error: true, message: "Invalid inputs", code: 422 };
}

export function serverSideError(): Res {
  return { error: true, message: "An error has occurred, please try again later.", code: 500 };
}