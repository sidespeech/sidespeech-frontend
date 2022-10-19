import React, { useEffect, useState } from "react";
import { Channel, Colony } from "../../../models/Colony";
import { useDispatch, useSelector } from "react-redux";
import { connect, fetchUserDatas } from "../../../redux/Slices/UserDataSlice";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import "./new-side.css";
import { RootState } from "../../../redux/store/app.store";
import { apiService } from "../../../services/api.service";
import ContainerLeft from "../ui-components/ContainerLeft";
import TabItems from "../ui-components/TabItems";

const initialStateSteps = [
  {
    label: 'Informations',
    icon: 'fa-solid fa-1',
    active: true,
    completed: false,
  },
  {
    label: 'Admission',
    icon: 'fa-solid fa-2',
    active: false,
    completed: false,
  },
  {
    label: 'Channels',
    icon: 'fa-solid fa-3',
    active: false,
    completed: false,
  },
  {
    label: 'Invitation',
    icon: 'fa-solid fa-4',
    active: false,
    completed: false,
  },
];

export default function NewSide(
) {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentSide } = useSelector((state: RootState) => state.appDatas);
  const userData = useSelector((state: RootState) => state.user);
  const [steps, setSteps] = useState<any>(initialStateSteps);

  useEffect(() => {
  }, []);

  const handleSteps = (index: number) => {
    const currentStepsState = steps.map((item : any, map_i : number) => {
      // Turn active or not for selected item
      item['active'] = (map_i === index) ? true : false;
      // Turn completed or not for previous or next items
      item['completed'] = (map_i < index ) ? true : false ;
      return item
    });
    setSteps(currentStepsState);
  };

  return (
    <>
      <nav>
        <div className="menu-icon">
          <span className="fas fa-bars"></span>
        </div>
        <div className="nav-items text-primary-light size-17">
          <li><i className="fa fa-circle-plus mr-2"></i> <label className='navTitle'> Create Side </label></li>
        </div>
      </nav>

      <div className="flex align-start w-100 text-left">
        <ContainerLeft>
        <label className="pl-4 sidebar-title  mb-2 mt-4">Steps</label>
          {steps.map((step: any, index: number) => {
            return (
              <TabItems key={index} className={`nav-link pl-5 pt-3 pb-3 ${step['active'] ? 'active' : ''} ${step['completed'] ? 'completed' : ''} sidebar-item text-secondary-dark`} onClick={() => handleSteps(index)}><i className={`${step['icon']} mr-2`}></i>{step['label']} {step['completed'] ? <i className="fa-solid fa-check ml-4"></i> : null}</TabItems>
            );
          })}
        </ContainerLeft>
      </div>
    </>
  );
}
