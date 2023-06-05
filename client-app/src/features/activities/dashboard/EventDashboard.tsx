import { Button, Grid, Loader } from "semantic-ui-react";
import EventList from "./EventList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponents from "../../../app/layout/LoadingComponents";
import { useEffect, useState } from "react";
import EventFilters from "./EventFilters";
import { PagingParams } from "../../../app/models/pagination";
import InfiniteScroll from "react-infinite-scroller";
import EventListItemPlaceholder from "./EventListItemPlaceholder";

export default observer(function EventDashboard() {
  const { eventStore } = useStore();
  const { loadEvents, events, setPagingParams, pagination } = eventStore;
  const [loadingNext, setLoadingNext] = useState(false);

  useEffect(() => {
    if (events.length <= 0) loadEvents();
  }, [events.length, loadEvents]);

  function handleGetNext() {
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage + 1));
    loadEvents().then(() => setLoadingNext(false));
  }

  return (
    <Grid>
      <Grid.Column width='10'>
        {eventStore.loadingInitial && !loadingNext ? (
          <>
            <EventListItemPlaceholder />
            <EventListItemPlaceholder />
            <EventListItemPlaceholder />
            <EventListItemPlaceholder />
          </>
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
            initialLoad={false}
          >
            <EventList />
          </InfiniteScroll>
        )}
      </Grid.Column>
      <Grid.Column width='6'>
        <EventFilters />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  );
});
