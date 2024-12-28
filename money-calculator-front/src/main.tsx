import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/styles/index.css';
import AppWrapper from '@/AppWrapper.tsx';

const root = createRoot(document.getElementById('root')!);

root.render(
    <StrictMode>
        <AppWrapper />
    </StrictMode>
);