import { Component } from 'react'
import type { ReactNode } from 'react'

/** 화면이 그려지다 오류가 나면 빈 화면 대신 오류 내용과 되돌아가기 버튼을 보여 준다 */
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    return (
      <div className="title-screen">
        <div className="about-card frame paper">
          <h1 className="about-title">화면을 그리지 못했습니다</h1>
          <p>아래 내용을 알려 주시면 고치는 데 도움이 됩니다.</p>
          <pre className="error-text">{`${error.name}: ${error.message}\n${navigator.userAgent}`}</pre>
          <div className="row center">
            <button className="primary" onClick={() => location.reload()}>
              처음으로
            </button>
          </div>
        </div>
      </div>
    )
  }
}
