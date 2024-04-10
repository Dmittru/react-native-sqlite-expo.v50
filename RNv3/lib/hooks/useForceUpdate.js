import { useState, useCallback } from 'react';

export default function useForceUpdate() {
    const [value, setValue] = useState(0);
    const forceUpdate = useCallback(() => setValue(prevValue => prevValue + 1), []);
    return [forceUpdate, value];
}