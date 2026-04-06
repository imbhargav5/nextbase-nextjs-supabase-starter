type Resource<T> = {
  read: () => T;
};

export function createSuspenseResource<T>(promise: Promise<T>): Resource<T> {
  let status = 'pending';
  let result: T | Error;

  const suspender = promise.then(
    (data) => {
      status = 'success';
      result = data;
    },
    (error) => {
      status = 'error';
      result = error;
    }
  );

  const read = (): T => {
    if (status === 'pending') {
      throw suspender;
    } else if (status === 'error') {
      throw result;
    } else if (status === 'success') {
      return result as T;
    } else {
      throw new Error('Unexpected status');
    }
  };

  return { read };
}
