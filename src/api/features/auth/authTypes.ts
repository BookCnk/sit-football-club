export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  user: {
    id: number;
    email: string;
    name: string | null;
    role: string;
  };
};
