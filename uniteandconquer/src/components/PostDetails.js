/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Comment from './Comment';
import '../assets/PostDetails.css';

const PostDB = require('../modules/PostDB');
const NotifDB = require('../modules/NotificationDB');

// In the post details page, one can choose to join the group
// if successful, redirect the user to the post which the user joins in
function PostDetails() {
  const [desiredQuantity, setDesiredQuantity] = useState(0);
  const [validQuantity, setValidQuantity] = useState(false);
  const [tags, setTags] = useState([
    'Appliances', 'Beauty & Care', 'Health & Household', 'Electronics',
  ]);
  const [groupUsers, setGroupUsers] = useState([
    { name: 'Anna', quantity: 3 },
    { name: 'John', quantity: 5 },
  ]);
  const navigate = useNavigate();
  const myStorage = window.sessionStorage;
  const [postDetails, setPostDetails] = useState('');
  const [joined, setJoined] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const postID = window.location.href.split('/').pop();
  const userID = myStorage.getItem('UserID');

  useEffect(async () => {
    await PostDB.getPost(postID, (success, details) => {
      if (success) {
        setPostDetails(details);
        if (userID !== details.ownerId) {
          setIsOwner(false);
        } else {
          setIsOwner(true);
        }
      }
    });
  }, [joined]);

  const kickUser = async (kickId) => {
    // finish it when the backend is ready
    await PostDB.leaveGroup(kickId, postID, (success, error) => {
      if (success) {
        const userIds = postDetails.group.map((member) => (member.userId));
        const content = `${myStorage.getItem('firstName')} leave the post ${postID}`;
        NotifDB.createNotification(userIds, content);
      } else {
        //
      }
    });
  };

  const handleDelete = () => {
    // finish it when the backend is ready
  };

  const joinGroup = async () => {
    await PostDB.joinGroup(userID, postID, desiredQuantity, (success, err) => {
      if (success) {
        setJoined(true);
        const userIds = postDetails.group.map((member) => (member.userId));
        const content = `${myStorage.getItem('firstName')} is join the post ${postID}`;
        NotifDB.createNotification(userIds, content);
      } else {
        //
      }
    });
  };

  const leaveGroup = async () => {
    await PostDB.leaveGroup(userID, postID, (success, error) => {
      if (success) {
        setJoined(false);
        const userIds = postDetails.group.map((member) => (member.userId));
        const content = `${myStorage.getItem('firstName')} leave the post ${postID}`;
        NotifDB.createNotification(userIds, content);
      } else {
        //
      }
    });
  };

  const back = () => {
    navigate('/');
  };

  const quantityValidation = () => {
    const num = /^\d+$/;

    if (desiredQuantity) {
      if (desiredQuantity.match(num)) {
        setValidQuantity(true);
      } else {
        setValidQuantity(false);
      }
    } else {
      setValidQuantity(false);
    }
  };

  useEffect(() => {
    quantityValidation();
  });

  if (postDetails) {
    return (
      <div className="post-details-page">
        <Sidebar />
        <div className="post-details-container">
          <div className="item-name">
            <h1>{postDetails.itemName}</h1>
          </div>
          <div className="post-details-content">
            <div className="item-details">
              <h3>Item Details</h3>
              <div className="item-detail">
                Target Quantity:
                {' '}
                {postDetails.itemNumTarget}
              </div>

              <div className="item-detail">
                Current Quantity:
                {' '}
                {postDetails.itemNumCurrent}
              </div>

              <div className="item-detail">
                Price/Item: $
                {postDetails.pricePerItem}
              </div>

              <div className="item-detail">
                Item Link:
                {' '}
                <a href={postDetails.itemURL}>Click here to go the item page</a>
              </div>

              <div className="item-detail">
                Description:
                {' '}
                {postDetails.itemDescription}
              </div>
            </div>
            <div className="group-details">
              <h3>Group Details</h3>
              <div className="size">
                Group size:
                {' '}
                {postDetails.group.length}
              </div>
              <div className="group-member">
                <ul>
                  {postDetails.group.map((user) => (
                    <div className="row-setting" key={user.firstName}>
                      <div className="group-user">
                        <div className="name">
                          {' '}
                          <i className="far fa-user-circle" />
                          {' '}
                          {user.firstName}
                        </div>
                        <div className="quantity">
                          Quantity:
                          {' '}
                          {user.quantity}
                        </div>
                        {isOwner
                          ? (
                            <div className="cross-sign-wrapper">
                              <button className="cross-sign" type="button" onClick={() => kickUser(user.userId)}> kick </button>
                            </div>
                          )
                          : null}
                      </div>
                    </div>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="comment-section">
            <Comment postID={postID} />
          </div>
          <div className="post-detail-tags">
            <div className="tags-label">Tags</div>
            <div className="tags-container">
              {postDetails.tags.map((tag) => (
                <button type="button" className="tag" key={tag}>{tag}</button>
              ))}
            </div>
          </div>
          <div className="buttons-container">
            <div className="desired-quantity">
              <input
                placeholder="desired quantity"
                onChange={(e) => setDesiredQuantity(e.target.value)}
              />
            </div>
            <div className="horizontal-buttons">
              {!joined ? (
                <button
                  disabled={!validQuantity}
                  className="create-button"
                  type="button"
                  onClick={joinGroup}
                >
                  Join
                </button>
              ) : (
                <button
                  disabled={!validQuantity}
                  className="create-button"
                  type="button"
                  onClick={leaveGroup}
                >
                  Leave
                </button>
              )}
              <button className="cancel-button" type="button" onClick={back}>
                Back
              </button>
              {isOwner ? (
                <button className="delete-button" type="button" onClick={handleDelete}>
                  Delete Post
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default PostDetails;
