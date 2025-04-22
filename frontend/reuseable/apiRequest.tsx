import { useEffect, useState } from "react";

interface ApiResponse<T> {
  data: {
    [key: string]: T;
  };
}

function useApiRequest<T>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  property: string,
  ...args: any[]
) {
    const [data, setData] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setIsError(false);
        apiFunction(...args)
            .then((response: ApiResponse<T>) => {
                setData(Array.isArray(response.data[property]) ? response.data[property] : [response.data[property]]);
                setIsLoading(false);
            })
            .catch(() => {
                setIsError(true);
                setIsLoading(false);
            });
    }, [apiFunction, property, ...args]);

    return { data, isLoading, isError };
}

export default useApiRequest;