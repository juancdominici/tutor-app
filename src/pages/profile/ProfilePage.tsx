import Icon, {
  ArrowLeftOutlined,
  DeleteOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  FormOutlined,
  InfoCircleOutlined,
  MoreOutlined,
  PlusOutlined,
  SendOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { getTutorAddresses } from '@app/api/addresses.api';
import { checkUserExistance as checkUserExistanceAction, getSessionData, getTutorProfileData } from '@app/api/auth.api';
import {
  addReview as addReviewAction,
  addTutorQuestion as addTutorQuestionAction,
  answerQuestion as answerQuestionAction,
  reportQuestion as reportQuestionAction,
  reportReview as reportReviewAction,
  getTutorQuestions,
  getTutorReviews,
  getTutorServices,
  getUnreviewedServices,
} from '@app/api/profiles.api';
import { Loading } from '@app/components/common/Loading';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { TextArea } from '@app/components/common/inputs/Input/Input';
import { LOCATION_TYPE } from '@app/constants/constants';
import { notificationController } from '@app/controllers/notificationController';
import { useLanguage } from '@app/hooks/useLanguage';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  Col,
  Dropdown,
  Empty,
  Input,
  Menu,
  Modal,
  Rate,
  Row,
  Select,
  Spin,
  Tabs,
  Typography,
} from 'antd';
import FormItem from 'antd/es/form/FormItem';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ReactComponent as leavesSvg } from '../../assets/images/leaves.svg';

export const ProfilePage = () => {
  const { language } = useLanguage();
  const formatter = new Intl.RelativeTimeFormat(language);
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state }: any = useLocation();
  const { Paragraph } = Typography;
  const [slide, setSlide] = useState('1');
  const [newQuestion, setNewQuestion] = useState('');
  const [answerQuestionModal, toggleAnswerQuestionModal] = useState(false);
  const [addReviewModal, toggleAddReviewModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [answerQuestionForm] = BaseForm.useForm();
  const [addReviewForm] = BaseForm.useForm();
  const queryClient = useQueryClient();

  const { data: tutorProfileData, isLoading } = useQuery(['userData', id], () => getTutorProfileData(id), {
    onSuccess: (data) => {
      if (!data) {
        navigate('/404');
      }
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const { data: unreviewedServices, isLoading: isLoadingUnreviewedServices } = useQuery(
    ['unreviewedServices', id],
    () => getUnreviewedServices(id),
    {
      refetchOnWindowFocus: false,
    },
  );

  const { data: sessionData, isLoading: isLoadingSessionData } = useQuery(['sessionData'], getSessionData, {
    refetchOnWindowFocus: false,
  });

  const [userExistanceQuery, tutorReviewsQuery, tutorQuestionsQuery, tutorServicesQuery] = useQueries({
    queries: [
      {
        queryKey: ['userType'],
        queryFn: checkUserExistanceAction,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ['tutorReviews', id],
        queryFn: () => getTutorReviews(id),
        enabled: !!id,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ['tutorQuestions', id],
        queryFn: () => getTutorQuestions(id),
        enabled: !!id,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ['tutorServices', id],
        queryFn: () => getTutorServices(id),
        enabled: !!id,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const { mutate: addTutorQuestion, isLoading: isAddingTutorQuestion } = useMutation(addTutorQuestionAction, {
    onSuccess: () => {
      setNewQuestion('');
      queryClient.invalidateQueries(['tutorQuestions', id]);
    },
  });

  const { mutate: answerQuestion, isLoading: isAnsweringQuestion } = useMutation(answerQuestionAction, {
    onSuccess: () => {
      toggleAnswerQuestionModal(false);
      answerQuestionForm.resetFields();
      setSelectedQuestion(null);
      notificationController.success({
        message: t('common.questionAnswered'),
      });
      queryClient.invalidateQueries(['tutorQuestions', id]);
    },
  });

  const { mutate: addReview, isLoading: isAddingReview } = useMutation(addReviewAction, {
    onSuccess: () => {
      toggleAddReviewModal(false);
      addReviewForm.resetFields();
      notificationController.success({
        message: t('common.reviewAdded'),
      });
      queryClient.invalidateQueries(['unreviewedServices', id]);
      queryClient.invalidateQueries(['userData', id]);
      queryClient.invalidateQueries(['tutorReviews', id]);
      queryClient.invalidateQueries(['tutorServices', id]);
    },
  });

  const { mutate: reportQuestion } = useMutation(reportQuestionAction, {
    onSuccess: () => {
      notificationController.success({
        message: t('common.questionReported'),
      });
      queryClient.invalidateQueries(['tutorQuestions', id]);
    },
  });
  const { mutate: reportReview } = useMutation(reportReviewAction, {
    onSuccess: () => {
      notificationController.success({
        message: t('common.reviewReported'),
      });
      queryClient.invalidateQueries(['tutorReviews', id]);
    },
  });

  const handleNewQuestion = () => {
    addTutorQuestion({
      tutor_id: id,
      question: newQuestion,
    });
  };

  const handleSubmitAnswer = (values: any) => {
    answerQuestion({
      id: selectedQuestion,
      a: values.answer,
    });
  };

  const handleSubmitReview = (values: any) => {
    addReview({
      tutor_service_id: values.service_id,
      text: values.review,
      date: new Date().toISOString(),
      score: values.score,
      report_count: 0,
      status: true,
    });
  };

  const handleReportQuestion = (question: any) => {
    reportQuestion({
      id: question.id,
      report_count: question.report_count + 1,
    });
  };

  const handleAdminReportQuestion = (question: any) => {
    reportQuestion({
      id: question.id,
      report_count: question.report_count + 99,
    });
  };

  const handleReportReview = (review: any) => {
    reportReview({
      id: review.id,
      report_count: review.report_count + 1,
    });
  };

  const handleAdminReportReview = (review: any) => {
    reportReview({
      id: review.id,
      report_count: review.report_count + 99,
    });
  };

  const handleNewRequest = (service: any) => {
    navigate(`/request/${service.id}`, {
      state: {
        service,
        ...(service.location === LOCATION_TYPE[1] && { address: state?.address, tutorId: id }),
      },
    });
  };

  const goBack = () => {
    navigate('/home');
  };

  const share = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Tutor - ${tutorProfileData?.name}`,
          text: `Mira el perfil de ${tutorProfileData?.name} en Tutor!`,
          url: window.location.href,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      console.log('Share not supported on this browser, do it the old way.');
    }
  };

  if (isLoading || isLoadingSessionData || isLoadingUnreviewedServices) {
    return <Loading />;
  }

  const reviewMenu = (review: any) => (
    <Menu>
      {userExistanceQuery?.data === 'admin' && (
        <Menu.Item
          danger
          icon={<DeleteOutlined />}
          style={{ fontSize: '0.8em' }}
          onClick={() => handleAdminReportReview(review)}
        >
          {t('common.reportAsAdmin')}
        </Menu.Item>
      )}
      <Menu.Item
        danger
        icon={<InfoCircleOutlined />}
        style={{ fontSize: '0.8em' }}
        onClick={() => handleReportReview(review)}
      >
        {t('common.report')}
      </Menu.Item>
    </Menu>
  );

  const menu = (question: any) => (
    <Menu>
      {userExistanceQuery?.data === 'tutor' && question.tutor_id === sessionData?.session?.user.id && !question.a && (
        <Menu.Item
          icon={<FormOutlined />}
          style={{ fontSize: '0.8em' }}
          onClick={() => {
            setSelectedQuestion(question.id);
            toggleAnswerQuestionModal(true);
          }}
        >
          {t('common.answer')}
        </Menu.Item>
      )}
      {userExistanceQuery?.data === 'admin' && (
        <Menu.Item
          danger
          icon={<DeleteOutlined />}
          style={{ fontSize: '0.8em' }}
          onClick={() => handleAdminReportQuestion(question)}
        >
          {t('common.reportAsAdmin')}
        </Menu.Item>
      )}

      <Menu.Item
        danger
        icon={<InfoCircleOutlined />}
        style={{ fontSize: '0.8em' }}
        onClick={() => handleReportQuestion(question)}
      >
        {t('common.report')}
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <PageTitle>{tutorProfileData?.name}</PageTitle>
      <Row align="middle" justify="space-between">
        <Button type="text" shape="circle" size="large" onClick={goBack}>
          <ArrowLeftOutlined style={{ transform: 'scale(1.2)' }} />
        </Button>

        <Button type="text" shape="circle" size="large" style={{ alignItems: 'end' }} onClick={share}>
          <ShareAltOutlined style={{ transform: 'scale(1.2)' }} />
        </Button>
      </Row>
      <Row align="middle" justify="space-around">
        <Col span={10}>
          <img
            src={`https://source.boringavatars.com/beam/120/${tutorProfileData?.name?.split(' ')[0]}%20${
              tutorProfileData?.name?.split(' ')[1]
            }?colors=3ECF8E,1A1E22,008640,F8FBFF`}
            alt="user-avatar"
            referrerPolicy="no-referrer"
            style={{
              borderRadius: '50%',
              padding: '2px',
              boxShadow: '0 0 0 1px #f3f3f333',
              pointerEvents: 'none',
              width: '5em',
              height: '5em',
              marginLeft: '2em',
            }}
          />
        </Col>
        {slide === '1' ? (
          <>
            <Col span={14}>
              <div>
                <span>{tutorProfileData?.name}</span>
              </div>
              <Rate
                character={<Icon component={leavesSvg} />}
                style={{
                  color: 'var(--primary-color)',
                  fontSize: '1.5em',
                  display: 'flex',
                  margin: '0 0.5em 0 0',
                }}
                value={tutorProfileData?.avg_score}
                allowHalf
                disabled
              />
              <div>
                <span
                  style={{
                    fontSize: '0.8em',
                  }}
                >
                  {tutorProfileData?.review_count === 1
                    ? t('common.review', {
                        count: tutorProfileData?.review_count,
                      })
                    : t('common.reviews', {
                        count: tutorProfileData?.review_count,
                      })}
                </span>
              </div>
              <Button
                style={{ position: 'absolute', right: 0, bottom: 0, transform: 'translateY(-25%)' }}
                type="link"
                onClick={() => setSlide('2')}
              >
                <DoubleRightOutlined />
              </Button>
            </Col>
          </>
        ) : (
          <Col span={14}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontSize: '0.8em', lineHeight: '0.9em' }}>{tutorProfileData?.bio}</p>
            </div>
            <Button
              style={{ position: 'absolute', right: 0, bottom: 0, transform: 'translateY(-15%)' }}
              type="link"
              onClick={() => setSlide('1')}
            >
              <DoubleLeftOutlined />
            </Button>
          </Col>
        )}
      </Row>
      <Row align="middle" justify="space-around">
        <Col span={24}>
          <Tabs defaultActiveKey="1" centered>
            <Tabs.TabPane tab={t('common.reviewsTitle')} key="1">
              {tutorReviewsQuery?.data?.map((review: any, i: any) => (
                <Card
                  key={review.id}
                  style={{ margin: '1em', marginBottom: i + 1 === tutorReviewsQuery?.data?.length ? '5em' : '' }}
                >
                  <Row justify="end">
                    <Dropdown overlay={reviewMenu(review)} placement="bottomRight" arrow>
                      <Button
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          zIndex: 1,
                        }}
                        type="text"
                        icon={<MoreOutlined />}
                      />
                    </Dropdown>
                  </Row>
                  <Row justify="space-between">
                    <Col span={6}>
                      <img
                        src={`https://source.boringavatars.com/beam/120/${review.user_profiles.name?.split(' ')[0]}%20${
                          review.user_profiles.name?.split(' ')[1]
                        }?colors=3ECF8E,1A1E22,008640,F8FBFF`}
                        alt="user-avatar"
                        referrerPolicy="no-referrer"
                        style={{
                          borderRadius: '50%',
                          padding: '2px',
                          boxShadow: '0 0 0 1px #f3f3f333',
                          pointerEvents: 'none',
                          width: '3em',
                          height: '3em',
                          marginTop: '0.5em',
                        }}
                      />
                    </Col>
                    <Col span={18}>
                      <Row justify="space-between">
                        <Col
                          span={24}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '0.5em',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.8em',
                              color: 'var(--primary-color)',
                            }}
                          >
                            {t('common.reviewBy', { name: review.user_profiles.name })}
                          </span>
                        </Col>
                        <Col span={24}>
                          <span
                            style={{
                              fontSize: '0.8em',
                              color: 'var(--secondary-color)',
                            }}
                          >
                            {t('common.reviewedService', { name: review.tutor_services.name })}
                          </span>
                        </Col>
                        <Col span={24}>
                          <span
                            style={{
                              fontSize: '0.8em',
                              color: 'var(--text-plain-color)',
                            }}
                          >
                            {formatter.format(
                              Math.round((new Date(review.date).getTime() - Date.now()) / (1000 * 3600 * 24)),
                              'days',
                            )}
                          </span>
                        </Col>
                        <Col span={24}>
                          <Rate
                            character={<Icon component={leavesSvg} />}
                            style={{
                              color: 'var(--primary-color)',
                              fontSize: '1.5em',
                              display: 'flex',
                              margin: '0 0.5em 0 0',
                            }}
                            value={review.score}
                            disabled
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <Paragraph
                            ellipsis={{
                              rows: 3,
                              expandable: true,
                              symbol: t('common.readMore'),
                            }}
                            style={{
                              fontSize: '0.8em',
                            }}
                          >
                            {review?.text}
                          </Paragraph>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
              ))}
              {tutorReviewsQuery?.data?.length === 0 && (
                <Empty
                  description={
                    <span
                      style={{
                        fontSize: '0.8em',
                        color: 'var(--secondary-color)',
                      }}
                    >
                      {t('common.noElementsOnList')}
                    </span>
                  }
                  style={{
                    marginTop: '2em',
                  }}
                />
              )}
              <Modal
                title={t('common.addReview')}
                visible={addReviewModal}
                okText={t('common.submit')}
                cancelText={t('common.cancel')}
                onCancel={() => toggleAddReviewModal(false)}
                onOk={() => {
                  addReviewForm
                    .validateFields()
                    .then((values) => {
                      handleSubmitReview(values);
                    })
                    .catch((info) => {
                      console.log('Validate Failed:', info);
                    });
                }}
                okButtonProps={{ loading: isAddingReview }}
              >
                <BaseForm form={addReviewForm} layout="vertical" onFinish={handleSubmitReview} requiredMark="optional">
                  <FormItem name="service_id" required rules={[{ required: true, message: t('common.requiredField') }]}>
                    <Select
                      placeholder={t('prompts.reviewService')}
                      style={{ fontSize: '0.8em', width: '100%', lineBreak: 'anywhere' }}
                      options={unreviewedServices?.map((service: any) => ({
                        label: `${service.tutor_services.name} | ${service.tutor_services.name} | ${formatter.format(
                          Math.round((new Date(service.date).getTime() - Date.now()) / (1000 * 3600 * 24)),
                          'days',
                        )}`,
                        value: service.tutor_services.id,
                      }))}
                    />
                  </FormItem>
                  <FormItem name="score" required rules={[{ required: true, message: t('common.requiredField') }]}>
                    <Rate
                      character={<Icon component={leavesSvg} />}
                      style={{
                        color: 'var(--primary-color)',
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '2em',
                      }}
                      defaultValue={5}
                    />
                  </FormItem>
                  <FormItem name="review" required rules={[{ required: true, message: t('common.requiredField') }]}>
                    <TextArea
                      style={{ fontSize: '0.8em', padding: '0.5em 1em', height: '10em' }}
                      placeholder={t('prompts.review')}
                    />
                  </FormItem>
                </BaseForm>
              </Modal>
              {!!unreviewedServices?.length && (
                <Button
                  type="primary"
                  shape="circle"
                  size="large"
                  style={{
                    position: 'fixed',
                    bottom: '5em',
                    right: '1em',
                  }}
                  onClick={() => toggleAddReviewModal(true)}
                >
                  <PlusOutlined style={{ transform: 'scale(1.2)' }} />
                </Button>
              )}
            </Tabs.TabPane>
            <Tabs.TabPane tab={t('common.questions')} key="2">
              {tutorQuestionsQuery?.data?.map((question: any, i: any) => (
                <Card
                  key={question.id}
                  style={{ margin: '1em', marginBottom: i + 1 === tutorQuestionsQuery?.data?.length ? '5em' : '' }}
                >
                  <Row justify="space-between">
                    <Col span={6}>
                      <img
                        src={`https://source.boringavatars.com/beam/120/${
                          question.user_profiles.name?.split(' ')[0]
                        }%20${question.user_profiles.name?.split(' ')[1]}?colors=3ECF8E,1A1E22,008640,F8FBFF`}
                        alt="user-avatar"
                        referrerPolicy="no-referrer"
                        style={{
                          borderRadius: '50%',
                          padding: '2px',
                          boxShadow: '0 0 0 1px #f3f3f333',
                          pointerEvents: 'none',
                          width: '3em',
                          height: '3em',
                          marginTop: '0.5em',
                        }}
                      />
                    </Col>
                    <Col span={18}>
                      <Row justify="space-between">
                        <Col
                          span={24}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.8em',
                              color: 'var(--primary-color)',
                            }}
                          >
                            {question.user_profiles.name}
                          </span>
                          <Dropdown overlay={menu(question)} placement="bottomRight" arrow>
                            <Button
                              style={{
                                position: 'absolute',
                                right: -10,
                                top: -10,
                              }}
                              type="text"
                              icon={<MoreOutlined />}
                            />
                          </Dropdown>
                        </Col>
                        <Col span={24}>
                          <span
                            style={{
                              fontSize: '0.8em',
                              color: 'var(--secondary-color)',
                            }}
                          >
                            {formatter.format(
                              Math.round((new Date(question.date).getTime() - Date.now()) / (1000 * 3600 * 24)),
                              'days',
                            )}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <Paragraph
                            ellipsis={{
                              rows: 3,
                              expandable: true,
                              symbol: t('common.readMore'),
                            }}
                            style={{
                              fontSize: '0.8em',
                            }}
                          >
                            {question?.q}
                          </Paragraph>
                        </Col>
                      </Row>
                    </Col>

                    <Col
                      span={24}
                      style={{
                        marginTop: '0.5em',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.8em',
                          color: 'var(--primary-color)',
                        }}
                      >
                        {question?.a ? t('common.tutorAnswered') : t('common.noAnswerYet')}
                      </span>
                      <Paragraph
                        ellipsis={{
                          rows: 4,
                          expandable: true,
                          symbol: t('common.readMore'),
                        }}
                        style={{
                          fontSize: '0.8em',
                        }}
                      >
                        {question?.a}
                      </Paragraph>
                    </Col>
                  </Row>
                </Card>
              ))}
              {tutorQuestionsQuery?.data?.length === 0 && (
                <Empty
                  description={
                    <span
                      style={{
                        fontSize: '0.8em',
                        color: 'var(--secondary-color)',
                      }}
                    >
                      {t('common.noElementsOnList')}
                    </span>
                  }
                  style={{
                    marginTop: '2em',
                  }}
                />
              )}
              {userExistanceQuery?.data === 'user' && (
                <Input.Group
                  compact
                  style={{
                    position: 'fixed',
                    bottom: 100,
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Input
                    style={{ width: '75%', maxWidth: '300px' }}
                    placeholder={t('prompts.askQuestion')}
                    value={newQuestion}
                    onChange={(e: any) => setNewQuestion(e.target.value)}
                  />
                  <Button
                    icon={isAddingTutorQuestion ? <Spin /> : <SendOutlined />}
                    onClick={() => handleNewQuestion()}
                    disabled={isAddingTutorQuestion}
                  />
                </Input.Group>
              )}
              <Modal
                title={t('common.answerQuestion')}
                visible={answerQuestionModal}
                okText={t('common.submit')}
                cancelText={t('common.cancel')}
                onCancel={() => toggleAnswerQuestionModal(false)}
                onOk={() => {
                  answerQuestionForm
                    .validateFields()
                    .then((values) => {
                      handleSubmitAnswer(values);
                    })
                    .catch((info) => {
                      console.log('Validate Failed:', info);
                    });
                }}
                okButtonProps={{ loading: isAnsweringQuestion }}
              >
                <BaseForm
                  form={answerQuestionForm}
                  layout="vertical"
                  onFinish={handleSubmitAnswer}
                  requiredMark="optional"
                >
                  <FormItem name="answer" required rules={[{ required: true, message: t('common.requiredField') }]}>
                    <TextArea size="large" style={{ fontSize: '1em', padding: '0.5em 1em', height: '10em' }} />
                  </FormItem>
                </BaseForm>
              </Modal>
            </Tabs.TabPane>
            <Tabs.TabPane tab={t('common.services')} key="3">
              {tutorServicesQuery?.data?.map((service: any) => (
                <Card key={service.id} style={{ margin: '1em' }}>
                  <Row align="middle" justify="space-between">
                    <Col span={24}>
                      <span>{service.name}</span>
                    </Col>
                    <Col span={24}>
                      <span
                        style={{
                          fontSize: '0.8em',
                          color: 'var(--primary-color)',
                        }}
                      >
                        {t(`constants.service_types.${service.type}`)} - {t(`constants.location.${service.location}`)}
                      </span>
                    </Col>
                    <Col span={12}>
                      <Rate
                        character={<Icon component={leavesSvg} />}
                        style={{
                          color: 'var(--primary-color)',
                          fontSize: '1.5em',
                          display: 'flex',
                          margin: '0 0.5em 0.5em 0',
                        }}
                        value={service?.avg_score}
                        allowHalf
                        disabled
                      />
                    </Col>
                    <Col span={12} style={{ display: 'flex', justifyContent: 'end' }}>
                      <span
                        style={{
                          fontSize: '0.8em',
                          marginRight: '0.5em',
                        }}
                      >
                        {service?.review_count === 1
                          ? t('common.review', {
                              count: service?.review_count,
                            })
                          : t('common.reviews', {
                              count: service?.review_count,
                            })}
                      </span>
                    </Col>
                  </Row>
                  <Row align="middle" justify="start">
                    <Col span={24}>
                      <Paragraph
                        ellipsis={{
                          rows: 4,
                          expandable: true,
                          symbol: t('common.readMore'),
                        }}
                        style={{
                          fontSize: '0.8em',
                        }}
                      >
                        {service?.description}
                      </Paragraph>
                    </Col>
                  </Row>
                  <Row align="middle" justify="space-between">
                    <Col span={12}>
                      <span
                        style={{
                          fontSize: '1.2em',
                        }}
                      >
                        {service?.price} ARS {service.is_unit_price ? t('common.perUnit') : ''}
                      </span>
                    </Col>
                    {userExistanceQuery?.data === 'user' && (
                      <Col span={12} style={{ display: 'flex', justifyContent: 'end' }}>
                        <Button
                          type="link"
                          onClick={() => handleNewRequest(service)}
                          style={{
                            borderRadius: '10px',
                            backgroundColor: 'rgba(var(--primary-rgb-color), 0.1)',
                          }}
                        >
                          {t('common.book')}
                        </Button>
                      </Col>
                    )}
                  </Row>
                </Card>
              ))}
              {tutorServicesQuery?.data?.length === 0 && (
                <Empty
                  description={
                    <span
                      style={{
                        fontSize: '0.8em',
                        color: 'var(--secondary-color)',
                      }}
                    >
                      {t('common.noElementsOnList')}
                    </span>
                  }
                  style={{
                    marginTop: '2em',
                  }}
                />
              )}
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </>
  );
};
