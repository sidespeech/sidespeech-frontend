import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import styled from "styled-components";

// Redux Stuff
import { updateChannel } from "../../redux/Slices/AppDatasSlice";
import { RootState } from "../../redux/store/app.store";

// UI Components
import Button from "../ui-components/Button";
import Modal from "../ui-components/Modal";

// Models
// import { Poll } from "../../models/Poll";

// API Service
import { apiService } from "../../services/api.service";
import { trigger } from "../../helpers/CustomEvent";
import { EventType } from "../../constants/EventType";
import InputText from "../ui-components/InputText";
import TextArea from "../ui-components/TextArea";
import { getRandomId } from "../../helpers/utilities";

const CreatePollModalStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: .5rem;  
  padding: 0 1rem;
  max-height: 75vh;
  .poll-field {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    & label {
      padding-left: .5rem;
    }
    &.answers {
      .answers-container {
        // max-height: 19vh;
        // overflow-y: scroll;
      }
    }
  }
`;

const FooterStyled = styled.footer`
  padding: 0 1rem;
  margin-top: 1rem;
  .cancel-btn {
    display: flex;
    align-items: center;
    background-color: transparent;
    border: none;
    outline: none;
    box-shadow: none;
    line-height: 14px;
    font-size: 14px;
    color: var(--text-secondary-dark);
    padding: 1rem 0;
  }
`;

interface AnswersProps {
  [key: string]: string;
}

const getNewEmptyAnswer = () => ({
  [getRandomId()]: ''
})

const answersInitialState = {
  ...getNewEmptyAnswer(),
  ...getNewEmptyAnswer()
}

export default function CreatePollModal({ showModal }: { showModal: any }) {

  // Configuring all of the states.
  const [answers, setAnswers] = useState<AnswersProps>(answersInitialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [proposalTitle, setProposalTitle] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const dispatch = useDispatch();
  const { selectedChannel } = useSelector((state: RootState) => state.appDatas);

  const addChild = () => {
    if(Object.keys(answers).length>= 7) return toast.error("You can not have more than 7 answers.", {toastId: getRandomId()})
    setAnswers(prevState => ({
      ...prevState,
      ...getNewEmptyAnswer()
    }));
  };

  const updateAnswer = (key: string, value: string) => {
    const answersCopy = {...answers};
    answersCopy[key] = value;
    setAnswers(answersCopy);
  }

  const removeAnswer = (key:string) => {
    if(Object.keys(answers).length <= 2) return toast.error('There has to be at least two options', {toastId: getRandomId()})
    const answersCopy = {...answers};
    delete answersCopy[key];
    setAnswers(answersCopy);
  }

  const handleQuestion = (event: any) => {
    setQuestion(event.target.value);
  };
  
  const handleProposalTitle = (event: any) => {
    setProposalTitle(event.target.value);
  };
  
  const handleEndDate = (event: any) => {
    setEndDate(event.target.value);
  };

  const handleSavePoll = async () => {
    try {
      setIsLoading(true);
      if (!selectedChannel) throw new Error('No channel selected');
      // Grab values from Poll.
      const createThePoll = await apiService.createPoll(selectedChannel?.id, window.ethereum.selectedAddress, proposalTitle, endDate, question, false, Object.values(answers), Date.now().toString());
      if (selectedChannel && createThePoll) {
        trigger(EventType.ADDED_POLL, createThePoll);   
        // Hide the modal after the admin has submitted the poll.
        showModal(false);
        // Show the success notification.
        toast.success("Poll has been created.", { toastId: 8 });
        // Send a dispatch event to update the channel that we are in with the latest data.
        dispatch(updateChannel(selectedChannel));    
      }
    } catch (error) {
      toast.error("Error when creating poll", { toastId: 9 });
    } finally {
      setIsLoading(false);
    }
  };

  const valid = proposalTitle && endDate && new Date(endDate).getTime() >= Date.now() && question && Object.values(answers).filter(ans => ans.trim().length > 0).length >= 2;

  return (
    <Modal
      showModal={showModal}
      width="550px"
      body={
        <CreatePollModalStyled className="w-100">
          <div className="poll-field">
            <label htmlFor="proposal-title">Proposal title *</label>
            <InputText
              glass={false}
              radius="7px"
              height={44}
              id="proposal-title"
              placeholder={"Type your proposal title here"}
              onChange={handleProposalTitle}
              bgColor="rgba(0, 0, 0, 0.2)"
              
              color={"var(--text-secondary)"}
            />
          </div>

          <div className="poll-field">
            <label htmlFor="end-date">End date *</label>
            <InputText
              bgColor="rgba(0, 0, 0, 0.2)"
              color={"var(--text-secondary)"}
              glass={false}
              height={44}
              iconRightPos={{ top: 11, right: 24 }}
              id="end-date"
              min={new Date().toISOString().split('T')[0]}
              onChange={handleEndDate}
              placeholder={"DD/MM/AAAA"}
              radius="7px"
              type="date"
            />
          </div>

          <div className="poll-field">
            <label htmlFor="question">Your question *</label>
            <TextArea
              glass={false}
              radius="7px"
              height={69}
              id="question"
              placeholder={"Type your proposal description"}
              onChange={handleQuestion}
              bgColor="rgba(0, 0, 0, 0.2)"
              color={"var(--text-secondary)"}
            />
          </div>
          <div className="poll-field answers">
            <label>Possible answers *</label>
            <div className="answers-container">
              {Object.entries(answers).map(([key, answer], index) => (
                <NewAnswer 
                  deleteDisabled={Object.keys(answers).length === 2}
                  index={index + 1} 
                  onChange={(val: any) => updateAnswer(key, val)}
                  onRemove={() => removeAnswer(key)}
                  value={answer} 
                />
              ))}
            </div>

            <Button
              background="var(--bg-secondary-light)"
              classes="fw-400 size-12 my-2"
              width={"100%"}
              onClick={addChild}
              disabled={Object.keys(answers).length === 7}
            >
              <svg className="mr-2" width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.66699 13.1666H9.33366V9.83329H12.667V8.16663H9.33366V4.83329H7.66699V8.16663H4.33366V9.83329H7.66699V13.1666ZM8.50033 17.3333C7.34755 17.3333 6.26421 17.1144 5.25033 16.6766C4.23644 16.2394 3.35449 15.6458 2.60449 14.8958C1.85449 14.1458 1.26088 13.2638 0.823659 12.25C0.385881 11.2361 0.166992 10.1527 0.166992 8.99996C0.166992 7.84718 0.385881 6.76385 0.823659 5.74996C1.26088 4.73607 1.85449 3.85413 2.60449 3.10413C3.35449 2.35413 4.23644 1.76024 5.25033 1.32246C6.26421 0.885237 7.34755 0.666626 8.50033 0.666626C9.6531 0.666626 10.7364 0.885237 11.7503 1.32246C12.7642 1.76024 13.6462 2.35413 14.3962 3.10413C15.1462 3.85413 15.7398 4.73607 16.177 5.74996C16.6148 6.76385 16.8337 7.84718 16.8337 8.99996C16.8337 10.1527 16.6148 11.2361 16.177 12.25C15.7398 13.2638 15.1462 14.1458 14.3962 14.8958C13.6462 15.6458 12.7642 16.2394 11.7503 16.6766C10.7364 17.1144 9.6531 17.3333 8.50033 17.3333Z" fill="white"/>
              </svg>
              Add an answer
            </Button>
          </div>
        </CreatePollModalStyled>
      }
      footer={
        <FooterStyled className="w-100 flex align-center justify-between">
          <button className="cancel-btn" onClick={() => showModal(false)}>
          <svg className="mr-2" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12L0 6L6 0L7.06875 1.05L2.86875 5.25H12V6.75H2.86875L7.06875 10.95L6 12Z" fill="#B4C1D2" fillOpacity="0.4"/>
          </svg>
            Cancel
          </button>
          <Button disabled={!valid || isLoading} width={"121px"} onClick={handleSavePoll}>
            Publish
          </Button>
        </FooterStyled>
      }
      title={null}
    />
  );
}

const NewAnswer = (props: any) => {
  return (
    <NewAnswerContainer>
      <div className="input-wrapper">
        <span className="answer-index">{props.index}</span>
        <div className="w-100 ml-2">
          <InputText
            bgColor="transparent"
            color={"var(--text-secondary)"}
            glass={false}
            radius="7px"
            height={44}
            placeholder={"Type your answer here"}
            onChange={(event: any) => props.onChange(event.target.value)}
            value={props.value}
          />
        </div>
      </div>

      <button disabled={props.deleteDisabled} onClick={props.onRemove} className="remove-btn">
        <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.75 1.75V0.25H11.25V1.75H0.75Z" fill="#DC4964"/>
        </svg>
      </button>
    </NewAnswerContainer>
  );
};

const NewAnswerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  margin: 1rem 0;
  .input-wrapper {
    width: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    padding: 0 8px 0 5px;
    display: flex;
    align-items: center;
    border-radius: 10px;
    .answer-index {
      background-color: var(--bg-secondary-light);
      padding: 9px 14px;
      border-radius: 5px;
    }
  }
  .remove-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 34px;
    background-color: rgba(220, 73, 100, 0.15);
    border: none;
    outline: none;
    box-shadow: none;
    &:disabled {
      filter: grayscate(1);
      opacity: .5;
    }
  }
`;
