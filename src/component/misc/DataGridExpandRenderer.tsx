import * as React from 'react';
import Box from '@mui/material/Box';
import { Paper, Popper, Typography } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useEffect } from 'react';
import { RenderString } from '../../report/ReportRecordProcessing';

interface GridCellExpandProps {
  value: string;
  width: number;
}

function isOverflown(element: Element): boolean {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

const GridCellExpand = React.memo((props: GridCellExpandProps) => {
  const { width, value } = props;
  const wrapper = React.useRef<HTMLDivElement | null>(null);
  const cellDiv = React.useRef(null);
  const cellValue = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showFullCell, setShowFullCell] = React.useState(false);
  const [showPopper, setShowPopper] = React.useState(false);

  const handleMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellValue.current!);
    setShowPopper(isCurrentlyOverflown);
    setAnchorEl(cellDiv.current);
    setShowFullCell(true);
  };

  const handleMouseLeave = () => {
    setShowFullCell(false);
  };

  React.useEffect(() => {
    if (!showFullCell) {
      return undefined;
    }

    function handleKeyDown(nativeEvent: KeyboardEvent) {
      // IE11, Edge (prior to using Bink?) use 'Esc'
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        setShowFullCell(false);
      } else if (nativeEvent.key.toLocaleLowerCase() === 'c' && (nativeEvent.ctrlKey || nativeEvent.metaKey === true)) {
        navigator.clipboard.writeText(value);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowFullCell, showFullCell]);

  return (
    <Box
      ref={wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        alignItems: 'center',
        lineHeight: '24px',
        width: '100%',
        height: 'fit-content!imporant!',
        position: 'relative',
        display: 'flex',
      }}
    >
      <Box
        ref={cellDiv}
        sx={{
          height: 'fit-content!imporant!',
          width,
          display: '-webkit-box',
          position: 'absolute',
          top: 0,
        }}
      />
      <Box
        ref={cellValue}
        sx={{
          whiteSpace: 'break-spaces',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: '2',
          WebkitBoxOrient: 'vertical',
        }}
      >
        {value}
      </Box>
      {showPopper && (
        <Popper open={showFullCell && anchorEl !== null} anchorEl={anchorEl} style={{ width, marginLeft: -17 }}>
          <Paper elevation={1} style={{ minHeight: wrapper.current!.offsetHeight - 3 }}>
            <Typography variant='body2' style={{ padding: 8, whiteSpace: 'normal', wordBreak: 'break-word' }}>
              {value}
            </Typography>
          </Paper>
        </Popper>
      )}
    </Box>
  );
});

export function renderCellExpand(params: GridRenderCellParams<any, string>, lineBreakAfterListEntry: boolean) {
  let value = params.value?.low ? params.value.low : params.value;
  if (typeof value === 'string' || value instanceof String) {
    const displayLink = RenderString(value);
    return <GridCellExpand value={displayLink || ''} width={params.colDef.computedWidth} />;
  }

  const stringifiedObj = value
    ? JSON.stringify(value)
      .replaceAll(',', lineBreakAfterListEntry ? ',\r\n' : ', ') // TODO: Consolidate to a regex
      .replaceAll(']', '')
      .replaceAll('[', '')
      .replaceAll('"', '')
    : '';

  return <GridCellExpand value={stringifiedObj || ''} width={params.colDef.computedWidth} />;
}
