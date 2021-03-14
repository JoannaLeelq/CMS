import React, { createContext, Dispatch, useContext, useReducer } from 'react';

const initState = {
  total: 0,
  notification: 0,
  message: 0,
};

export function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {
        ...state,
        [action.payload.type]: state[action.payload.type] + action.payload.count,
        total: state.total + action.payload.count,
      };
    case 'decrement':
      return {
        ...state,
        [action.payload.type]: state[action.payload.type] - action.payload.count,
        total: state.total - action.payload.count,
      };
    case 'reset':
      return { ...store };
    default:
      return { ...state };
  }
}

/**
 * Context is designed to share data that can be considered “global” for a tree of React components,
 * Context is primarily used when some data needs to be accessible by many components at different nesting levels.
 * step1: create context
 * step2: every context object comes with a Provider React component that allows consuming components to subscribe to context changes.
 *
 */

const MessageStatisticsContext = React.createContext(initState);

export const MessageProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initState);

  return (
    <MessageStatisticsContext.Provider value={{ messageStore: state, dispatch }}>
      {props.children}
    </MessageStatisticsContext.Provider>
  );
};

export const useMessageStatistic = () => useContext(MessageStatisticsContext);
