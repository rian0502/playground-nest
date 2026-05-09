const APP_NAME = 'flowtrans';

export const CacheKeys = {
    products: {
        list: `${APP_NAME}:products:list`,

        item: (id: string) =>
            `${APP_NAME}:products:item:${id}`,
    },

    users: {
        list: `${APP_NAME}:users:list`,

        item: (id: string) =>
            `${APP_NAME}:users:item:${id}`,
    },
};