import * as React from 'react';
import dayjs from 'dayjs';
import { TopicMessage } from 'generated-sources';
import JSONViewer from 'components/common/JSONViewer/JSONViewer';
import Dropdown from 'components/common/Dropdown/Dropdown';
import DropdownItem from 'components/common/Dropdown/DropdownItem';
import useDataSaver from 'lib/hooks/useDataSaver';
import VerticalElipsisIcon from 'components/Topics/List/VerticalElipsisIcon';

import MessageToggleIcon from './MessageToggleIcon';

type Tab = 'key' | 'content' | 'headers';

const Message: React.FC<{ message: TopicMessage }> = ({
  message: {
    timestamp,
    timestampType,
    offset,
    key,
    partition,
    content,
    headers,
  },
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<Tab>('content');
  const { copyToClipboard, saveFile } = useDataSaver(
    'topic-message',
    content || ''
  );

  const toggleIsOpen = () => setIsOpen(!isOpen);
  const handleKeyTabClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab('key');
  };
  const handleContentTabClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab('content');
  };
  const handleHeadersTabClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab('headers');
  };

  const activeTabContent = () => {
    switch (activeTab) {
      case 'content':
        return content;
      case 'key':
        return key;
      default:
        return JSON.stringify(headers);
    }
  };

  return (
    <>
      <tr>
        <td>
          <span className="is-clickable" onClick={toggleIsOpen} aria-hidden>
            <MessageToggleIcon isOpen={isOpen} />
          </span>
        </td>
        <td>{offset}</td>
        <td>{partition}</td>
        <td>
          <div className="tag">
            {dayjs(timestamp).format('MM.DD.YYYY HH:mm:ss')}
          </div>
        </td>
        <td
          style={{ maxWidth: 350, minWidth: 350 }}
          className="has-text-overflow-ellipsis is-family-code"
          title={key}
        >
          {key}
        </td>
        <td
          style={{ maxWidth: 350, minWidth: 350 }}
          className="has-text-overflow-ellipsis is-family-code"
        >
          {content}
        </td>
        <td className="has-text-right">
          <Dropdown label={<VerticalElipsisIcon />} right>
            <DropdownItem onClick={copyToClipboard}>
              Copy to clipboard
            </DropdownItem>
            <DropdownItem onClick={saveFile}>Save as a file</DropdownItem>
          </Dropdown>
        </td>
      </tr>
      {isOpen && (
        <tr className="has-background-light">
          <td />
          <td colSpan={3}>
            <div className="title is-7">Timestamp Type</div>
            <div className="subtitle is-7 is-spaced">{timestampType}</div>
            <div className="title is-7">Timestamp</div>
            <div className="subtitle is-7">{timestamp}</div>
          </td>
          <td colSpan={3} style={{ wordBreak: 'break-word' }}>
            <nav className="panel has-background-white">
              <p className="panel-tabs is-justify-content-start pl-5">
                <a
                  href="key"
                  onClick={handleKeyTabClick}
                  className={activeTab === 'key' ? 'is-active' : ''}
                >
                  Key
                </a>
                <a
                  href="content"
                  className={activeTab === 'content' ? 'is-active' : ''}
                  onClick={handleContentTabClick}
                >
                  Content
                </a>
                <a
                  href="headers"
                  className={activeTab === 'headers' ? 'is-active' : ''}
                  onClick={handleHeadersTabClick}
                >
                  Headers
                </a>
              </p>
              <div className="panel-block is-family-code">
                <JSONViewer data={activeTabContent() || ''} />
              </div>
            </nav>
          </td>
        </tr>
      )}
    </>
  );
};

export default Message;
