import {Button, Typography} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {FC, useMemo, useState} from 'react';
import {Assertion, ISpan, ITrace, SpanAssertionResult, Test} from 'types';
import {runAssertionBySpanId} from 'services/AssertionService';
import AssertionsResultTable from 'components/AssertionsTable/AssertionsTable';
import CreateAssertionModal from 'components/CreateAssertionModal';
import SkeletonTable from 'components/SkeletonTable';
import * as S from './SpanDetail.styled';
import Attributes from './Attributes';

type TSpanDetailProps = {
  test?: Test;
  targetSpan?: ISpan;
  trace?: ITrace;
};

const SpanDetail: FC<TSpanDetailProps> = ({test, targetSpan, trace}) => {
  const [openCreateAssertion, setOpenCreateAssertion] = useState(false);

  const assertionsResultList = useMemo(() => {
    if (!targetSpan?.spanId || !trace) {
      return [];
    }
    return (
      test?.assertions?.reduce<Array<{assertion: Assertion; assertionResultList: Array<SpanAssertionResult>}>>(
        (resultList, assertion) => {
          const assertionResultList = runAssertionBySpanId(targetSpan.spanId, trace, assertion);

          return assertionResultList ? [...resultList, {assertion, assertionResultList}] : resultList;
        },
        []
      ) || []
    );
  }, [targetSpan?.spanId, test?.assertions, trace]);

  return (
    <>
      <S.DetailsContainer>
        <S.DetailsHeader>
          <Typography.Text strong> Details for selected span</Typography.Text>
          <Button type="link" icon={<PlusOutlined />} onClick={() => setOpenCreateAssertion(true)}>
            Add Assertion
          </Button>
        </S.DetailsHeader>
        <SkeletonTable loading={!targetSpan || !trace}>
          {assertionsResultList.length ? (
            assertionsResultList.map(({assertion, assertionResultList}, index) => (
              <AssertionsResultTable
                key={assertion.assertionId}
                assertionResults={assertionResultList}
                sort={index + 1}
                assertion={assertion}
              />
            ))
          ) : (
            <S.DetailsEmptyStateContainer>
              <S.DetailsTableEmptyStateIcon />
              <Typography.Text disabled>No Data</Typography.Text>
            </S.DetailsEmptyStateContainer>
          )}
        </SkeletonTable>
      </S.DetailsContainer>
      <Attributes spanId={targetSpan?.spanId} trace={trace} />

      {targetSpan?.spanId && test?.testId && (
        <CreateAssertionModal
          key={`KEY_${targetSpan?.spanId}`}
          testId={test.testId}
          trace={trace}
          span={targetSpan!}
          open={openCreateAssertion}
          onClose={() => setOpenCreateAssertion(false)}
        />
      )}
    </>
  );
};

export default SpanDetail;
