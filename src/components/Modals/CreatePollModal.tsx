import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import styled from "styled-components";

// Redux Stuff
import { updateChannel } from "../../redux/Slices/AppDatasSlice";
import { RootState } from "../../redux/store/app.store";

// UI Components
import Button from "../ui-components/Button";
import InputText from "../ui-components/InputText";
import Modal from "../ui-components/Modal";

// Models
import { Poll } from "../../models/Poll";

// API Service
import { apiService } from "../../services/api.service";



export default function CreatePollModal({ showModal }: { showModal: any }) {

  // Configuring all of the states.
  const [answerElements, setAnswerElements] = useState<any[]>([]);
  const [values, setValues] = useState<string[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [polls, setPolls] = useState<Poll[]>([]);

  const dispatch = useDispatch();
  const { selectedChannel } = useSelector((state: RootState) => state.appDatas);
  
  useEffect(() => {
    const inits = [setAnswer, setAnswer];
    inits.forEach((element, index) => {
      answerElements.push(<NewAnswer onChange={element} value={index + 1} />);
    });
    setAnswerElements([...answerElements]);
  }, []);

  const addChild = () => {
    if(answerElements.length>= 7){
      toast.error("You can not have more than 7 answers.")
      return;
    }
    setAnswerElements([
      ...answerElements,
      <NewAnswer value={answerElements.length + 1} onChange={setAnswer} />,
    ]);
  };
  
  const setAnswer = (event: any, index: number) => {
    const val = event.target.value;
    values[index] = val;
    setValues([...values]);
  };

  const handleQuestion = (event: any) => {
    setQuestion(event.target.value);
  };

  const handleSavePoll = async () => {

    // Grab values from Poll.
    const createThePoll = apiService.createPoll(window.ethereum.selectedAddress, question, false, values, Date.now().toString());

    try {
      if (selectedChannel) {
        
        // Hide the modal after the admin has submitted the poll.
        showModal(false)

        // Show the success notification.
        toast.success("Poll has been created.", { toastId: 8 });

        // Send a dispatch event to update the channel that we are in with the latest data.
        dispatch(updateChannel(selectedChannel));

        // Can't get it to update so have to use this for the moment.
        window.location.reload();
        
      }
    } catch (error) {
      toast.error("Error when creating poll", { toastId: 9 });
    }
  };

  return (
    <Modal
      showModal={showModal}
      body={
        <div className="w-100">
          <div>Your question</div>
          <InputText
            glass={false}
            radius={"10px"}
            height={62}
            placeholder={""}
            onChange={handleQuestion}
            bgColor={"#242635"}
            color={"var(--text-secondary)"}
          />
          <div className="mt-3">
            <div>Possible answers</div>
            <div style={{ overflow: "auto", maxHeight: 334 }}>
              {answerElements.map((answer, index) => {
                return <div key={index}>{answer}</div>;
              })}
            </div>

            <Button
              classes="fw-400 size-12 my-2"
              width={"127px"}
              height={32}
              onClick={addChild}
            >
              + Add an answer
            </Button>
          </div>
        </div>
      }
      footer={
        <Button width={"129px"} height={43} onClick={handleSavePoll}>
          Send
        </Button>
      }
      title={<span>Create a new poll</span>}
    />
  );
}

const NewAnswer = (props: any) => {
  return (
    <NewAnswerContainer>
      {<span>{props.value}</span>}
      <div className="w-100 ml-2">
        <InputText
          glass={false}
          radius={"10px"}
          height={60}
          placeholder={""}
          onChange={(event: any) => props.onChange(event, props.value - 1)}
          color={"var(--text-secondary)"}
        />
      </div>
    </NewAnswerContainer>
  );
};

const NewAnswerContainer = styled.div`
  width: 100%;
  background-color: var(--bg-primary);
  padding: 8px 8px 8px 17px;
  display: flex;
  align-items: center;
  border-radius: 10px;
  margin-bottom: 8px;
`;
