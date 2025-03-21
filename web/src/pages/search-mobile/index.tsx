import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { isEmpty } from 'lodash';

import { LogOutIcon } from '@/assets/icon/Icon';
import {
  Button,
  Card,
  Divider,
  Flex,
  Input,
  Layout,
  Skeleton,
  Tag,
  theme,
} from 'antd';

import { IReference } from '@/interfaces/database/chat';

import { useFetchKnowledgeList } from '@/hooks/knowledge-hooks';
import { useLogout } from '@/hooks/login-hooks';

import { useSendQuestion } from '../search/hooks';

import MarkdownContent from '../chat/markdown-content';
import SearchSidebar from '../search/sidebar';

import styles from './index.less';

const { Header, Content } = Layout;
const { Search } = Input;

const SearchPage = () => {
  const { t } = useTranslation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { logout } = useLogout();

  const [checkedList, setCheckedList] = useState<string[]>([]);
  const { list: knowledgeList } = useFetchKnowledgeList();
  const checkedWithoutEmbeddingIdList = useMemo(() => {
    return checkedList.filter((x) => knowledgeList.some((y) => y.id === x));
  }, [checkedList, knowledgeList]);

  const {
    sendQuestion,
    handleClickRelatedQuestion,
    handleSearchStrChange,
    answer,
    sendingLoading,
    relatedQuestions,
    searchStr,
    isFirstRender,
  } = useSendQuestion(checkedWithoutEmbeddingIdList);

  const InputSearch = (
    <Search
      value={searchStr}
      onChange={handleSearchStrChange}
      placeholder={t('header.search')}
      allowClear
      enterButton
      onSearch={sendQuestion}
      size="large"
      loading={sendingLoading}
      disabled={checkedWithoutEmbeddingIdList.length === 0}
      className={isFirstRender ? styles.globalInput : styles.partialInput}
    />
  );

  const handleLogoutClick = () => {
    logout();
  };

  return (
    <>
      <Layout className={styles.pageWrapper}>
        <Header
          className={`${styles.pageHeader} p-6 pt-0 pb-0`}
          style={{
            backgroundColor: colorBgContainer,
          }}
        >
          <h1 className={styles.pageTitle}>搜索问答</h1>
          <Button
            type="text"
            icon={<LogOutIcon />}
            onClick={handleLogoutClick}
          />
        </Header>
        <Divider
          orientationMargin={0}
          style={{
            margin: 0,
          }}
        />
        <Layout className={styles.searchPage}>
          <SearchSidebar
            isFirstRender={isFirstRender}
            checkedList={checkedWithoutEmbeddingIdList}
            setCheckedList={setCheckedList}
            style={{
              display: 'none',
            }}
          ></SearchSidebar>
          <Layout>
            <Content>
              {isFirstRender ? (
                <Flex justify="center" className={styles.firstRenderContent}>
                  <Flex vertical align="center" gap={'large'}>
                    {InputSearch}
                  </Flex>
                </Flex>
              ) : (
                <Flex className={`${styles.content} pl-6 pr-6`}>
                  <section className={styles.main}>
                    {InputSearch}
                    <Card
                      title={
                        <Flex gap={10}>
                          <img src="/logo.svg" alt="" width={20} />
                          {t('chat.answerTitle')}
                        </Flex>
                      }
                      className={styles.answerWrapper}
                    >
                      {isEmpty(answer) && sendingLoading ? (
                        <Skeleton active />
                      ) : (
                        answer.answer && (
                          <MarkdownContent
                            loading={sendingLoading}
                            content={answer.answer}
                            reference={answer.reference ?? ({} as IReference)}
                            showReference={false}
                          ></MarkdownContent>
                        )
                      )}
                    </Card>
                    <Divider></Divider>
                    {relatedQuestions?.length > 0 && (
                      <div
                        style={{
                          paddingBottom: '10px',
                        }}
                      >
                        <Card title={t('chat.relatedQuestion')}>
                          <Flex wrap="wrap" gap={'10px 0'}>
                            {relatedQuestions?.map((x, idx) => (
                              <Tag
                                key={idx}
                                className={styles.tag}
                                onClick={handleClickRelatedQuestion(x)}
                              >
                                {x}
                              </Tag>
                            ))}
                          </Flex>
                        </Card>
                      </div>
                    )}
                  </section>
                </Flex>
              )}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
};

export default SearchPage;
