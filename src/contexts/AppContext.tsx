import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User } from '../types/auth';
import { Credential } from '../types/credentials';
import { Resource } from '../types/resources';

interface AppState {
  user: User | null;
  credentials: Credential[];
  resources: Resource[];
  loading: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_CREDENTIALS'; payload: Credential[] }
  | { type: 'SET_RESOURCES'; payload: Resource[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_CREDENTIAL'; payload: Credential }
  | { type: 'UPDATE_CREDENTIAL'; payload: Credential }
  | { type: 'DELETE_CREDENTIAL'; payload: string }
  | { type: 'ADD_RESOURCE'; payload: Resource }
  | { type: 'UPDATE_RESOURCE'; payload: Resource }
  | { type: 'DELETE_RESOURCE'; payload: string };

const initialState: AppState = {
  user: null,
  credentials: [],
  resources: [],
  loading: false,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_CREDENTIALS':
      return { ...state, credentials: action.payload };
    case 'SET_RESOURCES':
      return { ...state, resources: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'ADD_CREDENTIAL':
      return { ...state, credentials: [...state.credentials, action.payload] };
    case 'UPDATE_CREDENTIAL':
      return {
        ...state,
        credentials: state.credentials.map(cred =>
          cred._id === action.payload._id ? action.payload : cred
        ),
      };
    case 'DELETE_CREDENTIAL':
      return {
        ...state,
        credentials: state.credentials.filter(cred => cred._id !== action.payload),
      };
    case 'ADD_RESOURCE':
      return { ...state, resources: [...state.resources, action.payload] };
    case 'UPDATE_RESOURCE':
      return {
        ...state,
        resources: state.resources.map(res =>
          res._id === action.payload._id ? action.payload : res
        ),
      };
    case 'DELETE_RESOURCE':
      return {
        ...state,
        resources: state.resources.filter(res => res._id !== action.payload),
      };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};