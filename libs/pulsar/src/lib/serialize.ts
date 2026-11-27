export const serialize = <TData>(data: TData) => {
  return Buffer.from(JSON.stringify(data));
};

export const deserialize = <TData>(data: Buffer) => {
  return JSON.parse(data.toString()) as TData;
};
