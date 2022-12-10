export type FieldError = {
  message: string | null;
  field: string | null;
};

export type ErrorModel = {
  errorMessages?: Array<FieldError> | null;
};
