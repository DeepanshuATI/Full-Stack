import Editor from '@monaco-editor/react'
import { useTheme } from '../context/ThemeContext'

const CodeEditor = ({ value, onChange, language = 'javascript' }) => {
  const { theme } = useTheme()

  // Map language values to Monaco Editor language identifiers
  const getMonacoLanguage = (lang) => {
    const languageMap = {
      'javascript': 'javascript',
      'python': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'csharp': 'csharp',
      'go': 'go',
      'rust': 'rust',
      'typescript': 'typescript',
      'php': 'php',
      'ruby': 'ruby',
      'swift': 'swift',
      'kotlin': 'kotlin'
    }
    return languageMap[lang] || 'javascript'
  }

  return (
    <Editor
      height="100%"
      language={getMonacoLanguage(language)}
      value={value}
      onChange={onChange}
      theme={theme === 'dark' ? 'vs-dark' : 'light'}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
        padding: { top: 16, bottom: 16 }
      }}
    />
  )
}

export default CodeEditor
