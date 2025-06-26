import React, { useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { useStore } from "../../stores/StoreProvider";
import { ThemeStore } from "../../stores/ThemeStore";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const themeStore: ThemeStore = useStore().themeStore;
    const currentTheme = themeStore.getTheme;

    useEffect(() => {
        themeStore.init();
    }, []);

    const { defaultAlgorithm, darkAlgorithm } = theme;
    const algorithm = currentTheme === 'dark' ? darkAlgorithm : defaultAlgorithm;

    return (
        <ConfigProvider theme={{ algorithm }}>
            {children}
        </ConfigProvider>
    );
};