export enum Role {
  admin = "admin",
	staff = "staff",
	shareholder = "shareholder",
	associate = "associate",
	shareholder_spouse = "shareholder_spouse",
	associate_spouse = "associate_spouse",
	pee_wee = "pee_wee",
	junior = "junior",
	intermediate = "intermediate",
	social = "social",
	guest = "guest",
}

export interface User {
  id: number,
  username: string;
  firstname: string;
  lastname: string;
  address: string;
  phone: string;
  email: string;
  hashed_password: string;
  role: Role;
  shareholder1_username: string;
  shareholder2_username: string;
}

export interface FormProps<T> {
  initialValues?: any;
  beforeSubmit?: (values: T) => boolean | void;
  onSubmit: (values: T) => void;
  mode?: 'create' | 'update' | 'view'
}