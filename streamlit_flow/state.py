from dataclasses import dataclass, field
from .elements import StreamlitFlowNode, StreamlitFlowEdge
from typing import List, Dict
from datetime import datetime


@dataclass
class StreamlitFlowState:
    """
    Container to maintain the state of the flowchart component.

    Arguments
    - **nodes** : List[StreamlitFlowNode] : The list of nodes in the flowchart.
    - **edges** : List[StreamlitFlowEdge] : The list of edges in the flowchart.
    - **selected_id** : str? : The id of the selected node.
    - **timestamp** : float? : The timestamp of the state.
    """

    nodes: List[StreamlitFlowNode]
    edges: List[StreamlitFlowEdge]
    selected_id: str = None
    timestamp: int = field(
        default_factory=lambda: int(datetime.now().timestamp() * 1000)
    )

    def asdict(self):
        return {
            "nodes": [node.asdict() for node in self.nodes],
            "edges": [edge.asdict() for edge in self.edges],
            "selected_id": self.selected_id,
            "timestamp": self.timestamp,
        }

    def asdict_for_state_tracking(self):
        node_dicts = [node.asdict() for node in self.nodes]
        for node_dict in node_dicts:
            del node_dict["style"]
        return {"nodes": node_dicts, "edges": [edge.asdict() for edge in self.edges]}

    def from_dict(dict: Dict):
        return StreamlitFlowState(
            nodes=[
                StreamlitFlowNode.from_dict(node_dict)
                for node_dict in dict.get("nodes", [])
            ],
            edges=[
                StreamlitFlowEdge.from_dict(edge_dict)
                for edge_dict in dict.get("edges", [])
            ],
            selected_id=dict.get("selected_id", None),
        )
