'use client';

import { createContext } from 'react';

const RouterProgressionContext = createContext<() => void>(() => undefined);

export default RouterProgressionContext;
