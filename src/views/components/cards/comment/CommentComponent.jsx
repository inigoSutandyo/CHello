import React, { Component } from "react";
import { IoSend } from "react-icons/io5";
import { Mention, MentionsInput } from "react-mentions";
import { addCardComment, mentionUser, notifyWatchers } from "../../../../controller/CardController";

export default class CommentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: "",
      mentions: []  
    };
  }

  render() {
    // console.log(this.props.users)
    return (
      <>
        <MentionsInput
          className="form-control"
          id="comment"
          value={this.state.comment}
          onChange={(e) => {
            this.setState({ comment: e.target.value });
          }}
          markup="![__email__](__index__)"
        >
          <Mention
            trigger="!"
            data={this.props.users}
            renderSuggestion={this.renderUserSuggestion}
            onAdd = {(id) => {
                // console.log(id)
                this.setState({
                    mentions: [...this.state.mentions, id]
                })
            }}
          />
        </MentionsInput>
        <button
          className="btn btn-outline-secondary"
          type="button"
          id="btn-comment"
          onClick={() => {
            const content = document.getElementById("comment").value;
            addCardComment(this.props.card.uid, this.props.boardId, this.props.userId, content)
            notifyWatchers(this.props.userId, this.props.card.uid, this.props.boardId)
            if (this.state.mentions.length !== 0) {
                mentionUser(this.state.mentions, this.props.userId).then(console.log("mentioned"))
            }
            this.setState({ comment: "", mentions: [] });
          }}
        >
          <IoSend />
        </button>
      </>
    );
  }
}
