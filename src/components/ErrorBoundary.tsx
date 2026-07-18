import { Component, type ReactNode } from "react";

type Props = { children: ReactNode; fallback: ReactNode };
type State = { hasError: boolean };

// Catches render errors in its subtree so one broken panel (e.g. bad AI output) can't blank the whole app
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  // Flags the boundary once a child throws during render
  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
