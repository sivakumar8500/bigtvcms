import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Link,
  FormatClear,
  Code,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatColorText,
  BorderColor,
} from '@mui/icons-material';

interface HtmlEditorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  placeholder?: string;
  isDark: boolean;
  minHeight?: string;
}

export const HtmlEditor: React.FC<HtmlEditorProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder = 'Write content here...',
  isDark,
  minHeight = '150px',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [formatBlock, setFormatBlock] = useState('p');

  // Sync value from parent, but only if it's different from current innerHTML
  useEffect(() => {
    if (editorRef.current && !isCodeMode) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, isCodeMode]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, arg: string = '') => {
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleLink = () => {
    const url = prompt('Enter link URL (e.g. https://google.com):');
    if (url !== null) {
      executeCommand('createLink', url);
    }
  };

  const handleFormatBlockChange = (val: string) => {
    setFormatBlock(val);
    executeCommand('formatBlock', val);
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setTextColor(color);
    executeCommand('foreColor', color);
  };

  const handleBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setBgColor(color);
    executeCommand('backColor', color);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%', position: 'relative' }}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
      />
      <Typography
        variant="caption"
        sx={{
          color: error ? '#f44336' : (isDark ? '#d0caeb' : '#5c548a'),
          fontWeight: 700,
          display: 'block',
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          border: error
            ? '2px solid #f44336'
            : (isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.15)'),
          borderRadius: '10px',
          overflow: 'hidden',
          backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#ffffff',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Toolbar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 0.5,
            p: 0.75,
            borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
            backgroundColor: isDark ? 'rgba(38, 28, 86, 0.2)' : '#fbfbfb',
          }}
        >
          <Tooltip title="Bold">
            <IconButton
              size="small"
              onClick={() => executeCommand('bold')}
              disabled={isCodeMode}
              sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}
            >
              <FormatBold fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Italic">
            <IconButton
              size="small"
              onClick={() => executeCommand('italic')}
              disabled={isCodeMode}
              sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}
            >
              <FormatItalic fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Underline">
            <IconButton
              size="small"
              onClick={() => executeCommand('underline')}
              disabled={isCodeMode}
              sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}
            >
              <FormatUnderlined fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

          <Tooltip title="Text Align Left">
            <IconButton
              size="small"
              onClick={() => executeCommand('justifyLeft')}
              disabled={isCodeMode}
              sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}
            >
              <FormatAlignLeft fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Text Align Center">
            <IconButton
              size="small"
              onClick={() => executeCommand('justifyCenter')}
              disabled={isCodeMode}
              sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}
            >
              <FormatAlignCenter fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Text Align Right">
            <IconButton
              size="small"
              onClick={() => executeCommand('justifyRight')}
              disabled={isCodeMode}
              sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}
            >
              <FormatAlignRight fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

          <Tooltip title="Bullet List">
            <IconButton
              size="small"
              onClick={() => executeCommand('insertUnorderedList')}
              disabled={isCodeMode}
              sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}
            >
              <FormatListBulleted fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Ordered List">
            <IconButton
              size="small"
              onClick={() => executeCommand('insertOrderedList')}
              disabled={isCodeMode}
              sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}
            >
              <FormatListNumbered fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

          {/* Heading block selector */}
          <FormControl size="small" variant="standard" sx={{ minWidth: 70, mx: 0.5 }} disabled={isCodeMode}>
            <Select
              value={formatBlock}
              onChange={(e) => handleFormatBlockChange(e.target.value as string)}
              displayEmpty
              sx={{
                fontSize: '0.75rem',
                color: isDark ? '#d0caeb' : '#5c548a',
                '&:before, &:after': { border: 'none !important' },
                '& .MuiSelect-select': { py: 0.4 },
              }}
            >
              <MenuItem value="p">Paragraph</MenuItem>
              <MenuItem value="<h1>">Heading 1</MenuItem>
              <MenuItem value="<h2>">Heading 2</MenuItem>
              <MenuItem value="<h3>">Heading 3</MenuItem>
            </Select>
          </FormControl>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

          {/* Text Color input */}
          <Tooltip title="Text Color">
            <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <IconButton size="small" disabled={isCodeMode} sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
                <FormatColorText fontSize="small" />
              </IconButton>
              <input
                type="color"
                value={textColor}
                onChange={handleTextColorChange}
                disabled={isCodeMode}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                }}
              />
            </Box>
          </Tooltip>

          {/* Background Highlight Color input */}
          <Tooltip title="Background Highlight Color">
            <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <IconButton size="small" disabled={isCodeMode} sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}>
                <BorderColor fontSize="small" />
              </IconButton>
              <input
                type="color"
                value={bgColor}
                onChange={handleBgColorChange}
                disabled={isCodeMode}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                }}
              />
            </Box>
          </Tooltip>

          <Tooltip title="Link">
            <IconButton
              size="small"
              onClick={handleLink}
              disabled={isCodeMode}
              sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}
            >
              <Link fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Clear Formatting">
            <IconButton
              size="small"
              onClick={() => executeCommand('removeFormat')}
              disabled={isCodeMode}
              sx={{ color: isDark ? '#d0caeb' : '#5c548a' }}
            >
              <FormatClear fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />

          <Tooltip title={isCodeMode ? "WYSIWYG Mode" : "View HTML Code"}>
            <IconButton
              size="small"
              onClick={() => setIsCodeMode(!isCodeMode)}
              sx={{
                color: isCodeMode ? (isDark ? '#a6e2f5' : '#1c1445') : (isDark ? '#d0caeb' : '#5c548a'),
                backgroundColor: isCodeMode ? (isDark ? 'rgba(166,226,245,0.12)' : 'rgba(28,20,69,0.06)') : 'transparent',
              }}
            >
              <Code fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Content Area */}
        {isCodeMode ? (
          <Box
            component="textarea"
            value={value}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
            placeholder="Write HTML code here..."
            sx={{
              width: '100%',
              minHeight,
              border: 'none',
              outline: 'none',
              p: 2,
              fontFamily: 'Consolas, Courier New, monospace',
              fontSize: '0.82rem',
              backgroundColor: isDark ? '#1a162c' : '#ffffff',
              color: isDark ? '#a6e2f5' : '#1c1445',
              resize: 'vertical',
            }}
          />
        ) : (
          <Box
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            data-placeholder={placeholder}
            sx={{
              width: '100%',
              minHeight,
              p: 2,
              outline: 'none',
              color: isDark ? '#ffffff' : '#1c1445',
              backgroundColor: isDark ? 'transparent' : '#ffffff',
              overflowY: 'auto',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              '&:empty:before': {
                content: 'attr(data-placeholder)',
                color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
                pointerEvents: 'none',
                display: 'block',
              },
            }}
          />
        )}
      </Box>

      {error && (
        <Typography variant="caption" sx={{ color: '#f44336', fontWeight: 600 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};
