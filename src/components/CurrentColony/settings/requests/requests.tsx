import React, { useEffect, useState } from "react";
import Button from "../../../ui-components/Button";
import InputText from "../../../ui-components/InputText";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./requests.css";
import { apiService } from "../../../../services/api.service";
import CustomCheckbox from "../../../ui-components/CustomCheckbox";
import moment from 'moment'
import { Side } from "../../../../models/Side";
import { State, Type } from "../../../../models/Invitation";



export default function Requests({
  currentSide, userData, updateRequestNotifications
}: {
  currentSide: Side;
  userData: any;
  updateRequestNotifications:any;
}) {


  const [requests, setRequests] = useState<any[]>([]);

  const dispatch = useDispatch();

  const getRequestsUsers = async (requestsOrdered: any[]) => {
    let ids = requestsOrdered.map((invitation: any) => invitation['senderId']);
    const users = (await apiService.getUsersByIds(ids)).reduce((prev: any, current: any, index: number) => {

      let obj = { accounts: '', created_at: '', image: '', id: '', user_id: '' };
      const current_request = requestsOrdered.find(item => item['senderId'] === current['id']);

      obj['accounts'] = current['accounts'];
      obj['created_at'] = current_request['created_at'];
      obj['id'] = current_request['id'];
      obj['user_id'] = current['id'];
      obj['image'] = 'https://images.unsplash.com/photo-1662948291101-691f9fa850d2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80';

      prev.push(obj);

      return prev
    }, []);
    setRequests(users);
  };

  useEffect(() => {
    let requestsOrdered = currentSide['invitations'].filter((invitation: any) => invitation['type'] === Type.Request && invitation['state'] === State.Pending);
    getRequestsUsers(requestsOrdered);
  }, [currentSide, userData]);

  const onAccept = async (request:any, index:number) => {
    let res = await apiService.acceptRequest({id : request['id'] });
    // let res = await apiService.updateInvitationState(request['id'], State.Accepted);
    let newRequests = [...requests]
    newRequests.splice(index, 1);
    setRequests(newRequests)
    window.location.reload();
  };

  const onDecline = async (request:any, index:number) => {
    let res = await apiService.updateInvitationState(request['id'], State.Declined);
    let newRequests = [...requests]
    newRequests.splice(index, 1);
    setRequests(newRequests)
    updateRequestNotifications();
  };

  return (
    <>

      {/* Search Section */}
      <div className="f-column mt-5">
        <div className="text-primary-light mb-3 text fw-600">They want to join your side</div>
        <div className="flex align-center justify-between mr-5">
          <InputText
            placeholderColor="var(--placeholer)"
            color="var(--placeholer)"
            parentWidth={"30%"}
            height={45}
            width="85%"
            bgColor="var(--bg-secondary-dark)"
            glass={true}
            iconRightPos={{ top: 12, right: 80 }}
            placeholder={"Search"}
            onChange={undefined}
            radius="5px"
          />
          <div className="flex align-center ">
            <span className="mr-4">Only verified users</span>{" "}
            <CustomCheckbox
              isChecked={false}
              onClick={undefined}
            />

            <Button
              width={159}
              height={46}
              onClick={undefined}
              radius={10}
              background={"transparent"}
              color={"var(--red)"}
            >
              Decline all
            </Button>

            <Button
              width={159}
              height={46}
              onClick={undefined}
              radius={10}
              background={"var(--bg-secondary-light)"}
              color={"white"}
            >
              Accept all
            </Button>
          </div>
        </div>
      </div>

      {

        requests.map(
          (request, index) => {
            return (
              <div className="f-column mt-3 requests-list" key={index}>
                <div className="flex align-center justify-between">
                  <div>
                    <small className="date-label">{moment.utc(request['created_at']).local().startOf('seconds').fromNow()}</small>
                    <div className="flex mt-2">
                      <label className="profile-image-user f-column align-center justify-center">
                        <img style={{ height: "inherit", width: "inherit", objectFit: "cover" }}
                          src={request['image']}
                          alt="file"
                        />
                      </label>
                      <label className="align-center justify-center mt-2 ml-3">{request['accounts'].replace(request['accounts'].substring(4,30), "...")}</label>
                    </div>
                  </div>
                  <div className="flex align-center">
                    <Button
                      width={159}
                      height={46}
                      onClick={() => onDecline(request, index)}
                      radius={10}
                      background={"var(--red-opacity)"}
                      color={"var(--red)"}
                      classes={"mr-4"}
                    >
                      Decline
                    </Button>
                    <Button
                      width={159}
                      height={46}
                      onClick={() => onAccept(request, index)}
                      radius={10}
                      color={"var(--text-primary-light)"}
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              </div>
            )
          }
        )
      }


    </>
  );
}
