import EmberObject from "@ember/object";
import computed from "ember-addons/ember-computed-decorators";
import { ajax } from "discourse/lib/ajax";
import Plan from "discourse/plugins/discourse-subscriptions/discourse/models/plan";

const UserSubscription = EmberObject.extend({
  @computed("status")
  canceled(status) {
    return status === "canceled";
  },

  destroy() {
    return ajax(`/s/user/subscriptions/${this.id}`, {
      method: "delete"
    }).then(result => UserSubscription.create(result));
  }
});

UserSubscription.reopenClass({
  findAll() {
    return ajax("/s/user/subscriptions", { method: "get" }).then(result =>
      result.map(subscription => {
        subscription.plan = Plan.create(subscription.plan);
        return UserSubscription.create(subscription);
      })
    );
  }
});

export default UserSubscription;
