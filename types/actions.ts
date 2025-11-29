export type ActionState<T = undefined> = {
    success?: boolean;
    error?: string | Record<string, string[]>;
    data?: T;
};
