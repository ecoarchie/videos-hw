export type FieldError = {
  message: string | null;
  field: string | null;
};

export type ErrorModel = {
  errorsMessages?: Array<FieldError> | null;
};
