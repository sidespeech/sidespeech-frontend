import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import styled from "styled-components";
import { updateChannel } from "../../redux/Slices/AppDatasSlice";
import { RootState } from "../../redux/store/app.store";
import moralisService from "../../service/moralis.service";
import Button from "../ui-components/Button";
import InputText from "../ui-components/InputText";
import Modal from "../ui-components/Modal";

export default function CreatePollModal({ showModal }: { showModal: any }) {
  const [answerElements, setAnswerElements] = useState<any[]>([]);
  const [values, setValues] = useState<string[]>([]);
  const [question, setQuestion] = useState<string>("");

  const { selectedChannel } = useSelector((state: RootState) => state.appDatas);
  const dispatch = useDispatch();

  useEffect(() => {
    const inits = [setAnswer, setAnswer];
    inits.forEach((element, index) => {
      answerElements.push(<NewAnswer onChange={element} value={index + 1} />);
    });
    setAnswerElements([...answerElements]);
  }, []);

  const addChild = () => {
    if(answerElements.length>= 10){
      toast.error("You can not have more than 10 answers.")
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
    try {
      if (selectedChannel) {
        const newChannel = await moralisService.proposePoll(
          question,
          values,
          false,
          selectedChannel
        );
        toast.success("Poll has been created.", { toastId: 8 });
        dispatch(updateChannel(newChannel));
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
              width={127}
              height={32}
              onClick={addChild}
            >
              + Add an answer
            </Button>
          </div>
        </div>
      }
      footer={
        <Button width={129} height={43} onClick={handleSavePoll}>
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
